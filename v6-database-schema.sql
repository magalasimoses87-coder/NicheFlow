CREATE TABLE IF NOT EXISTS user_progress (
 id SERIAL PRIMARY KEY,
 user_id INTEGER,
 xp INTEGER DEFAULT 0,
 level INTEGER DEFAULT 1,
 completed_lessons INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS learning_streaks (
 user_id INTEGER PRIMARY KEY,
 current_streak INTEGER DEFAULT 0,
 longest_streak INTEGER DEFAULT 0,
 last_checkin DATE
);