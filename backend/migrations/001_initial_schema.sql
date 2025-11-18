-- DateWise Database Schema
-- Initial migration for MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  location VARCHAR(255) NOT NULL,
  occupation VARCHAR(255),

  -- Profile details
  interests TEXT,
  values TEXT,
  lifestyle TEXT,
  relationship_goals TEXT,
  deal_breakers TEXT,
  personality TEXT,
  photos TEXT[], -- Array of photo URLs

  -- Preferences
  age_preference_min INTEGER DEFAULT 18 CHECK (age_preference_min >= 18),
  age_preference_max INTEGER DEFAULT 100 CHECK (age_preference_max <= 100),
  location_preference VARCHAR(255),

  -- Metadata
  profile_completed BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT age_preference_valid CHECK (age_preference_max >= age_preference_min)
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_last_active ON users(last_active);

-- Activities table (pre-populated catalog)
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  description TEXT,
  country VARCHAR(20) NOT NULL CHECK (country IN ('singapore', 'indonesia', 'both')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster category and country filtering
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_country ON activities(country);

-- User Activities (user's selected activities with customization)
CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,

  -- Customization
  specific_venue TEXT,
  location_area VARCHAR(255),
  preferred_time VARCHAR(255),
  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure user doesn't select same activity twice
  UNIQUE(user_id, activity_id)
);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_activity ON user_activities(activity_id);

-- Matches table (stores daily match assignments)
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  user_a_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- When this match was shown
  shown_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- AI-generated insights (stored as JSON)
  ai_compatibility_reasons JSONB,
  ai_date_suggestions JSONB,
  shared_activities JSONB,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure we don't show same pair twice
  UNIQUE(user_a_id, user_b_id),
  -- Ensure A and B are different users
  CHECK (user_a_id != user_b_id)
);

CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_matches_shown_date ON matches(shown_date);

-- Interests table (like/pass actions)
CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Ensure user can only express interest once per match
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_interests_from_user ON interests(from_user_id);
CREATE INDEX idx_interests_to_user ON interests(to_user_id);
CREATE INDEX idx_interests_status ON interests(status);

-- Date Plans table (scheduled meetups)
CREATE TABLE date_plans (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  selected_activity_id INTEGER REFERENCES activities(id),
  venue_name VARCHAR(255),
  date_time TIMESTAMP,

  status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),

  -- Contact info (shared after mutual match)
  user_a_contact VARCHAR(255),
  user_b_contact VARCHAR(255),

  -- Feedback
  user_a_feedback VARCHAR(20) CHECK (user_a_feedback IN ('good', 'not_good', 'no_show')),
  user_b_feedback VARCHAR(20) CHECK (user_b_feedback IN ('good', 'not_good', 'no_show')),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_date_plans_match ON date_plans(match_id);
CREATE INDEX idx_date_plans_status ON date_plans(status);

-- Messages table (minimal messaging for coordination)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL CHECK (LENGTH(message_text) <= 500),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_messages_expires ON messages(expires_at);

-- AI Recommendations table (for tracking and analytics)
CREATE TABLE ai_recommendations (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  prompt_used TEXT,
  response_json JSONB,
  model_version VARCHAR(50),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_recommendations_match ON ai_recommendations(match_id);
CREATE INDEX idx_ai_recommendations_date ON ai_recommendations(generated_at);

-- Function to update last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_active on user updates
CREATE TRIGGER trigger_update_last_active
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_last_active();

-- View for mutual matches (makes queries easier)
CREATE VIEW mutual_matches AS
SELECT
  i1.match_id,
  i1.from_user_id as user_a_id,
  i1.to_user_id as user_b_id,
  i1.created_at as user_a_interested_at,
  i2.created_at as user_b_interested_at,
  GREATEST(i1.created_at, i2.created_at) as matched_at
FROM interests i1
JOIN interests i2 ON
  i1.from_user_id = i2.to_user_id
  AND i1.to_user_id = i2.from_user_id
WHERE
  i1.status = 'accepted'
  AND i2.status = 'accepted'
  AND i1.from_user_id < i1.to_user_id; -- Avoid duplicates

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles and authentication';
COMMENT ON TABLE activities IS 'Pre-populated catalog of date activities';
COMMENT ON TABLE user_activities IS 'User-selected activities with custom preferences';
COMMENT ON TABLE matches IS 'Daily match assignments with AI insights';
COMMENT ON TABLE interests IS 'Like/pass actions from users';
COMMENT ON TABLE date_plans IS 'Scheduled meetups between matched users';
COMMENT ON TABLE messages IS 'Limited messaging for date coordination';
COMMENT ON TABLE ai_recommendations IS 'AI-generated match insights for analytics';
