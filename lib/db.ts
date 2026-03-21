import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

// Create a lazy-initialized sql function that throws at query time if not configured
let _sql: NeonQueryFunction<false, false> | null = null;

export const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please add it in the Vars section of settings.');
    }
    if (!_sql) {
      _sql = neon(DATABASE_URL);
    }
    return (_sql as any)(...args);
  },
  get(_target, prop) {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set. Please add it in the Vars section of settings.');
    }
    if (!_sql) {
      _sql = neon(DATABASE_URL);
    }
    return (_sql as any)[prop];
  }
});

// User queries
export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0];
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  role: 'patient' | 'therapist',
  phone?: string
) {
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, role, phone)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${role}, ${phone || null})
    RETURNING id, email, full_name, role
  `;
  return result[0];
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `;
  return result[0];
}

// Patient profile queries
export async function createPatientProfile(userId: number, phone?: string) {
  const result = await sql`
    INSERT INTO patient_profiles (user_id, phone)
    VALUES (${userId}, ${phone || null})
    RETURNING *
  `;
  return result[0];
}

export async function getPatientProfile(userId: number) {
  const result = await sql`
    SELECT * FROM patient_profiles WHERE user_id = ${userId}
  `;
  return result[0];
}

// Therapist profile queries
export async function createTherapistProfile(userId: number, phone?: string) {
  const result = await sql`
    INSERT INTO therapist_profiles (user_id, phone)
    VALUES (${userId}, ${phone || null})
    RETURNING *
  `;
  return result[0];
}

export async function getTherapistProfile(userId: number) {
  const result = await sql`
    SELECT * FROM therapist_profiles WHERE user_id = ${userId}
  `;
  return result[0];
}

// Treatment plan queries
export async function createTreatmentPlan(
  patientId: number,
  therapistId: number,
  title: string,
  description: string,
  startDate: string,
  endDate?: string
) {
  const result = await sql`
    INSERT INTO treatment_plans (patient_id, therapist_id, title, description, start_date, end_date)
    VALUES (${patientId}, ${therapistId}, ${title}, ${description}, ${startDate}, ${endDate || null})
    RETURNING *
  `;
  return result[0];
}

export async function getTreatmentPlansByPatient(patientId: number) {
  const result = await sql`
    SELECT * FROM treatment_plans WHERE patient_id = ${patientId} ORDER BY created_at DESC
  `;
  return result;
}

export async function getTreatmentPlanById(planId: number) {
  const result = await sql`
    SELECT * FROM treatment_plans WHERE id = ${planId}
  `;
  return result[0];
}

// Goal queries
export async function createGoal(
  planId: number,
  title: string,
  description?: string,
  targetDate?: string,
  priority?: string
) {
  const result = await sql`
    INSERT INTO goals (treatment_plan_id, title, description, target_date, priority)
    VALUES (${planId}, ${title}, ${description || null}, ${targetDate || null}, ${priority || 'medium'})
    RETURNING *
  `;
  return result[0];
}

export async function getGoalsByPlan(planId: number) {
  const result = await sql`
    SELECT * FROM goals WHERE treatment_plan_id = ${planId} ORDER BY created_at DESC
  `;
  return result;
}

export async function getGoalById(goalId: number) {
  const result = await sql`
    SELECT * FROM goals WHERE id = ${goalId}
  `;
  return result[0];
}

// Action queries
export async function createAction(
  goalId: number,
  title: string,
  description?: string,
  dueDate?: string
) {
  const result = await sql`
    INSERT INTO actions (goal_id, title, description, due_date)
    VALUES (${goalId}, ${title}, ${description || null}, ${dueDate || null})
    RETURNING *
  `;
  return result[0];
}

export async function getActionsByGoal(goalId: number) {
  const result = await sql`
    SELECT * FROM actions WHERE goal_id = ${goalId} ORDER BY created_at DESC
  `;
  return result;
}

export async function updateActionStatus(actionId: number, status: string) {
  const result = await sql`
    UPDATE actions SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${actionId}
    RETURNING *
  `;
  return result[0];
}

// Chill zone resources queries
export async function getChillZoneResources(language: 'amharic' | 'afan_oromo', type?: string) {
  if (type) {
    const result = await sql`
      SELECT * FROM chill_zone_resources WHERE language = ${language} AND type = ${type} AND is_active = true
      ORDER BY created_at DESC
    `;
    return result;
  }
  const result = await sql`
    SELECT * FROM chill_zone_resources WHERE language = ${language} AND is_active = true
    ORDER BY created_at DESC
  `;
  return result;
}

// Mood log queries
export async function createMoodLog(
  patientId: number,
  moodScore: number,
  moodLabel?: string,
  notes?: string
) {
  const result = await sql`
    INSERT INTO mood_logs (patient_id, mood_level, mood_description, notes)
    VALUES (${patientId}, ${moodScore}, ${moodLabel || null}, ${notes || null})
    RETURNING *
  `;
  return result[0];
}

export async function getMoodLogsByPatient(patientId: number, limit: number = 30) {
  const result = await sql`
    SELECT * FROM mood_logs WHERE patient_id = ${patientId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result;
}

// Therapist notes queries
export async function createTherapistNote(
  patientId: number,
  therapistId: number,
  note: string,
  sessionDate?: string
) {
  const result = await sql`
    INSERT INTO therapist_notes (patient_id, therapist_id, note, session_date)
    VALUES (${patientId}, ${therapistId}, ${note}, ${sessionDate || null})
    RETURNING *
  `;
  return result[0];
}

export async function getTherapistNotesByPatient(patientId: number) {
  const result = await sql`
    SELECT * FROM therapist_notes WHERE patient_id = ${patientId}
    ORDER BY created_at DESC
  `;
  return result;
}

// Session queries
export async function createSession(
  patientId: number,
  therapistId: number,
  sessionDate: string,
  sessionType?: string
) {
  const result = await sql`
    INSERT INTO sessions (patient_id, therapist_id, session_date, session_type)
    VALUES (${patientId}, ${therapistId}, ${sessionDate}, ${sessionType || 'in_person'})
    RETURNING *
  `;
  return result[0];
}

export async function getSessionsByPatient(patientId: number) {
  const result = await sql`
    SELECT * FROM sessions WHERE patient_id = ${patientId}
    ORDER BY session_date DESC
  `;
  return result;
}

// Get therapist's patients
export async function getTherapistPatients(therapistId: number) {
  const result = await sql`
    SELECT DISTINCT u.* FROM users u
    INNER JOIN treatment_plans tp ON u.id = tp.patient_id
    WHERE tp.therapist_id = ${therapistId}
    ORDER BY u.full_name
  `;
  return result;
}
