CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  plan TEXT NOT NULL DEFAULT 'pro_monthly',
  current_period_end TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  niche TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS path_items (
  id TEXT PRIMARY KEY,
  path_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  source TEXT,
  source_url TEXT,
  metadata TEXT,
  FOREIGN KEY(path_id) REFERENCES learning_paths(id)
);
CREATE INDEX IF NOT EXISTS idx_path_items_path_position ON path_items(path_id, position);
