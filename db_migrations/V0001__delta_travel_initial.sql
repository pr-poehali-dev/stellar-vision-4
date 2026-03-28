CREATE TABLE IF NOT EXISTS delta_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30),
  birth_date DATE,
  passport_series VARCHAR(10),
  passport_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delta_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES delta_users(id),
  token VARCHAR(128) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS delta_tour_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES delta_users(id),
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  destination VARCHAR(200),
  departure_date VARCHAR(50),
  duration VARCHAR(50),
  adults INTEGER DEFAULT 2,
  children INTEGER DEFAULT 0,
  budget VARCHAR(100),
  comment TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delta_sessions_token ON delta_sessions(token);
CREATE INDEX IF NOT EXISTS idx_delta_sessions_user ON delta_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_delta_requests_user ON delta_tour_requests(user_id);
