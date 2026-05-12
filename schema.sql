-- ============================================
-- SKILLSWAP DATABASE SCHEMA
-- Run this file to create all tables
-- ============================================


-- ============================================
-- TABLE 1: users
-- Must be created FIRST because offers and
-- swap_requests both depend on it
-- ============================================

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT,
  google_id     VARCHAR(200),
  created_at    TIMESTAMP DEFAULT NOW()
);


-- ============================================
-- TABLE 2: offers
-- Must be created SECOND because it depends
-- on users (via user_id foreign key)
-- ============================================

CREATE TABLE offers (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offering_skill VARCHAR(100) NOT NULL,
  seeking_skill  VARCHAR(100) NOT NULL,
  level          VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Expert')),
  format         VARCHAR(20) CHECK (format IN ('Video Call', 'Async', 'In-person')),
  description    TEXT,
  photo_url      TEXT,
  is_matched     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW()
);


-- ============================================
-- TABLE 3: swap_requests
-- Must be created LAST because it depends
-- on BOTH users and offers
-- ============================================

CREATE TABLE swap_requests (
  id         SERIAL PRIMARY KEY,
  offer_id   INTEGER NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  sender_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


-- ============================================
-- INDEXES (speeds up common queries)
-- ============================================

-- Speed up finding all offers by a user
CREATE INDEX idx_offers_user_id ON offers(user_id);

-- Speed up finding all requests on an offer
CREATE INDEX idx_swap_requests_offer_id ON swap_requests(offer_id);

-- Speed up finding all requests sent by a user
CREATE INDEX idx_swap_requests_sender_id ON swap_requests(sender_id);

-- Speed up keyword search on offers
CREATE INDEX idx_offers_search ON offers 
  USING GIN(to_tsvector('english', offering_skill || ' ' || seeking_skill || ' ' || COALESCE(description, '')));
