CREATE TABLE IF NOT EXISTS users (
 id SERIAL PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
 id SERIAL PRIMARY KEY,
 title TEXT NOT NULL,
 skill TEXT NOT NULL,
 xp_reward INTEGER DEFAULT 50
);

CREATE TABLE IF NOT EXISTS lesson_progress (
 id SERIAL PRIMARY KEY,
 user_id INTEGER REFERENCES users(id),
 lesson_id INTEGER REFERENCES lessons(id),
 completed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
 id SERIAL PRIMARY KEY,
 user_id INTEGER REFERENCES users(id),
 paypal_subscription_id TEXT,
 status TEXT DEFAULT 'inactive'
);