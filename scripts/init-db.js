#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(500) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'therapist')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient profiles
CREATE TABLE IF NOT EXISTS patient_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  date_of_birth DATE,
  phone VARCHAR(20),
  address TEXT,
  emergency_contact VARCHAR(255),
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist profiles
CREATE TABLE IF NOT EXISTS therapist_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  license_number VARCHAR(100),
  specializations TEXT,
  bio TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Treatment plans
CREATE TABLE IF NOT EXISTS treatment_plans (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  therapist_id INTEGER NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goals
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL REFERENCES treatment_plans(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actions
CREATE TABLE IF NOT EXISTS actions (
  id SERIAL PRIMARY KEY,
  goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chill Zone resources
CREATE TABLE IF NOT EXISTS chill_zone_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(100) NOT NULL CHECK (resource_type IN ('meditation', 'breathing_exercise', 'relaxation', 'mindfulness')),
  duration_minutes INTEGER,
  content_url VARCHAR(500),
  language VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood logs
CREATE TABLE IF NOT EXISTS mood_logs (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist notes
CREATE TABLE IF NOT EXISTS therapist_notes (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  therapist_id INTEGER NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  therapist_id INTEGER NOT NULL REFERENCES therapist_profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_profiles_user_id ON therapist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient_id ON treatment_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_therapist_id ON treatment_plans(therapist_id);
CREATE INDEX IF NOT EXISTS idx_goals_plan_id ON goals(plan_id);
CREATE INDEX IF NOT EXISTS idx_actions_goal_id ON actions(goal_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_patient_id ON mood_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_therapist_notes_patient_id ON therapist_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON sessions(patient_id);
`;

async function initDatabase() {
  try {
    console.log('🗄️  Initializing Relief-Zone database...\n');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    let created = 0;
    let skipped = 0;

    for (const statement of statements) {
      try {
        console.log(`⏳ Executing: ${statement.substring(0, 60)}...`);
        await sql(statement);
        console.log(`   ✓ OK`);
        created++;
      } catch (error) {
        const msg = error?.message || '';
        if (msg.includes('already exists') || msg.includes('duplicate')) {
          console.log(`   ℹ  Skipped (already exists)`);
          skipped++;
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Database initialization complete!');
    console.log(`   Created: ${created} statements`);
    console.log(`   Skipped: ${skipped} statements\n`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error);
    return false;
  }
}

initDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
