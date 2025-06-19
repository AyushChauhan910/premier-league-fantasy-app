
-- Fantasy Football Database Schema
CREATE TYPE player_position AS ENUM ('GK', 'DEF', 'MID', 'FWD');
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table (user's fantasy teams)  
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    team_name VARCHAR(100) NOT NULL,
    budget_remaining DECIMAL(10,2) DEFAULT 100.00,
    total_points INTEGER DEFAULT 0,
    gameweek_points INTEGER DEFAULT 0,
    transfers_made INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Premier League players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    api_id INTEGER UNIQUE NOT NULL, -- From Football-Data.org
    name VARCHAR(100) NOT NULL,
    position player_position NOT NULL, -- GK, DEF, MID, FWD
    team VARCHAR(50) NOT NULL,
    price DECIMAL(5,1) NOT NULL CHECK (price > 0),
    total_points INTEGER DEFAULT 0,
    gameweek_points INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    clean_sheets INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team selections (which players are in user's team)
CREATE TABLE team_selections (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    is_captain BOOLEAN DEFAULT FALSE,
    is_vice_captain BOOLEAN DEFAULT FALSE,
    is_playing BOOLEAN DEFAULT TRUE,
    position_in_team INTEGER CHECK (position_in_team BETWEEN 1 AND 15),
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, player_id)
);

-- Gameweeks table
CREATE TABLE gameweeks (
    id SERIAL PRIMARY KEY,
    gameweek_number INTEGER NOT NULL UNIQUE CHECK (gameweek_number > 0),
    deadline TIMESTAMP NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    is_finished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    api_id INTEGER UNIQUE NOT NULL,
    gameweek_id INTEGER NOT NULL REFERENCES gameweeks(id),
    home_team VARCHAR(50) NOT NULL,
    away_team VARCHAR(50) NOT NULL,
    home_score INTEGER CHECK (home_score >= 0),
    away_score INTEGER CHECK (away_score >= 0),
    match_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'live', 'finished')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player gameweek stats
CREATE TABLE player_gameweek_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    gameweek_id INTEGER NOT NULL REFERENCES gameweeks(id),
    match_id INTEGER NOT NULL REFERENCES matches(id),
    minutes_played INTEGER DEFAULT 0, 
    goals SMALLINT DEFAULT 0 CHECK (goals >= 0),
    assists SMALLINT DEFAULT 0 CHECK (assists >= 0),
    clean_sheets SMALLINT DEFAULT 0 CHECK (clean_sheets >= 0),
    yellow_cards SMALLINT DEFAULT 0 CHECK (yellow_cards >= 0),
    red_cards SMALLINT DEFAULT 0 CHECK (red_cards >= 0),
    own_goals SMALLINT DEFAULT 0 CHECK (own_goals >= 0),
    penalties_saved SMALLINT DEFAULT 0 CHECK (penalties_saved >= 0),
    penalties_missed SMALLINT DEFAULT 0 CHECK (penalties_missed >= 0),
    saves SMALLINT DEFAULT 0 CHECK (saves >= 0),
    bonus_points SMALLINT DEFAULT 0 CHECK (bonus_points >= 0),
    total_points SMALLINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, gameweek_id, match_id)
);

-- Leagues table (mini-leagues for groups of friends)
CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL, -- Join code
    admin_user_id INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- League memberships
CREATE TABLE league_memberships (
    id SERIAL PRIMARY KEY,
    league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(league_id, user_id)
);

-- Indexes for better performance
CREATE INDEX idx_teams_user_id ON teams(user_id);
CREATE INDEX idx_team_selections_team_id ON team_selections(team_id);
CREATE INDEX idx_team_selections_player_id ON team_selections(player_id);
CREATE INDEX idx_player_gameweek_stats_player_id ON player_gameweek_stats(player_id);
CREATE INDEX idx_player_gameweek_stats_gameweek_id ON player_gameweek_stats(gameweek_id);
CREATE INDEX idx_matches_gameweek_id ON matches(gameweek_id);
CREATE INDEX idx_league_memberships_league_id ON league_memberships(league_id);
CREATE INDEX idx_league_memberships_user_id ON league_memberships(user_id);
