const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = Number(process.env.PORT || 10000);
const HOST = '0.0.0.0';
const ROOT = __dirname;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : null;

const schemaPath = path.join(ROOT, 'schema.postgres.sql');
async function initDb() {
  if (!pool) return;
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('PostgreSQL schema ready.');
}

const niches = {
  money: 'Make Money Online',
  programming: 'Programming',
  fitness: 'Fitness',
  design: 'Design',
  business: 'Business',
  languages: 'Languages'
};

function requireDb(res) {
  if (!pool) {
    res.status(503).json({ ok: false, error: 'Database is not connected yet. Add DATABASE_URL in Render.' });
    return false;
  }
  return true;
}

function authUser(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('nicheflow_token='))?.split('=')[1];
  if (!token) return res.status(401).json({ ok: false, error: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-only-change-this-secret');
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Invalid or expired session.' });
  }
}

app.get('/api/health', async (req, res) => {
  let database = 'not-configured';
  if (pool) {
    try { await pool.query('SELECT 1'); database = 'connected'; }
    catch { database = 'error'; }
  }
  res.json({ ok: true, service: 'NicheFlow', database, youtube: Boolean(process.env.YOUTUBE_API_KEY) });
});

app.get('/api/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const nicheKey = String(req.query.niche || '').trim();
  const type = String(req.query.type || 'all').trim();
  const level = String(req.query.level || 'any').trim();
  if (!q || !nicheKey || !niches[nicheKey]) {
    return res.status(400).json({ ok: false, error: 'A query and locked niche are required.' });
  }
  if (!process.env.YOUTUBE_API_KEY) {
    return res.json({ ok: true, mode: 'demo', q, niche: niches[nicheKey], type, level, results: [] });
  }

  const nicheName = niches[nicheKey];
  const query = `${q} ${nicheName}`;
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '12',
    safeSearch: 'moderate',
    key: process.env.YOUTUBE_API_KEY
  });
  try {
    const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ ok: false, error: data.error?.message || 'YouTube API error.' });
    const results = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      source: 'YouTube',
      niche: nicheName
    }));
    res.json({ ok: true, mode: 'youtube', q, niche: nicheName, type, level, results });
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Could not reach YouTube.', detail: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  if (!requireDb(res)) return;
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const displayName = String(req.body.displayName || '').trim() || null;
  if (!email || password.length < 8) return res.status(400).json({ ok: false, error: 'Email and a password of at least 8 characters are required.' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rowCount) return res.status(409).json({ ok: false, error: 'An account with that email already exists.' });
    const id = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO users(id,email,display_name,password_hash) VALUES($1,$2,$3,$4)', [id, email, displayName, hash]);
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET || 'dev-only-change-this-secret', { expiresIn: '7d' });
    res.json({ ok: true, token, user: { id, email, displayName } });
  } catch (err) { res.status(500).json({ ok: false, error: 'Registration failed.', detail: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  if (!requireDb(res)) return;
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  try {
    const result = await pool.query('SELECT id,email,display_name,password_hash FROM users WHERE email=$1', [email]);
    if (!result.rowCount || !(await bcrypt.compare(password, result.rows[0].password_hash))) return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    const u = result.rows[0];
    const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET || 'dev-only-change-this-secret', { expiresIn: '7d' });
    res.json({ ok: true, token, user: { id: u.id, email: u.email, displayName: u.display_name } });
  } catch (err) { res.status(500).json({ ok: false, error: 'Login failed.', detail: err.message }); }
});

app.get('/api/auth/me', authUser, async (req, res) => {
  if (!requireDb(res)) return;
  const result = await pool.query('SELECT id,email,display_name,created_at FROM users WHERE id=$1', [req.user.id]);
  if (!result.rowCount) return res.status(404).json({ ok: false, error: 'User not found.' });
  const u = result.rows[0];
  res.json({ ok: true, user: { id: u.id, email: u.email, displayName: u.display_name, createdAt: u.created_at } });
});

app.post('/api/learning-paths', authUser, async (req, res) => {
  if (!requireDb(res)) return;
  const title = String(req.body.title || 'My Learning Path').trim();
  const niche = String(req.body.niche || '').trim();
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!niche) return res.status(400).json({ ok: false, error: 'Niche is required.' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const pathId = crypto.randomUUID();
    await client.query('INSERT INTO learning_paths(id,user_id,title,niche) VALUES($1,$2,$3,$4)', [pathId, req.user.id, title, niche]);
    for (let i = 0; i < items.length; i++) {
      const item = items[i] || {};
      await client.query('INSERT INTO path_items(id,path_id,position,content_type,title,source,source_url,metadata) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [crypto.randomUUID(), pathId, i + 1, item.contentType || 'video', item.title || 'Untitled lesson', item.source || null, item.sourceUrl || null, JSON.stringify(item.metadata || {})]);
    }
    await client.query('COMMIT');
    res.json({ ok: true, id: pathId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: 'Could not save learning path.', detail: err.message });
  } finally { client.release(); }
});

app.post('/api/subscriptions/webhook', async (req, res) => {
  // PayPal webhook verification belongs here before changing subscription state.
  res.json({ ok: true, received: true });
});

app.use(express.static(ROOT, { extensions: ['html'] }));
app.get('*', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

initDb().then(() => {
  app.listen(PORT, HOST, () => console.log(`NicheFlow listening on http://${HOST}:${PORT}`));
}).catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
