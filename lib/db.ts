import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const sql = neon(DATABASE_URL);

// 🔒 Centralized DB error handler
async function runQuery<T>(queryFn: () => Promise<T>, label: string): Promise<T | null> {
  try {
    return await queryFn();
  } catch (error: any) {
    console.error(`❌ DB ERROR [${label}]`, {
      message: error?.message,
      code: error?.code,
    });
    return null;
  }
}

// ================= USER =================

export async function getUserByEmail(email: string) {
  const result = await runQuery(
    () => sql`SELECT * FROM users WHERE email = ${email}`,
    'getUserByEmail'
  );
  return result?.[0] || null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  role: 'patient' | 'therapist',
  phone?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO users (email, password_hash, full_name, role, phone)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${role}, ${phone || null})
      RETURNING id, email, full_name, role
    `,
    'createUser'
  );
  return result?.[0] || null;
}

export async function getUserById(id: number) {
  const result = await runQuery(
    () => sql`SELECT * FROM users WHERE id = ${id}`,
    'getUserById'
  );
  return result?.[0] || null;
}

// ================= PATIENT =================

export async function createPatientProfile(userId: number, phone?: string) {
  const result = await runQuery(
    () => sql`
      INSERT INTO patient_profiles (user_id, phone)
      VALUES (${userId}, ${phone || null})
      RETURNING *
    `,
    'createPatientProfile'
  );
  return result?.[0] || null;
}

export async function getPatientProfile(userId: number) {
  const result = await runQuery(
    () => sql`
      SELECT * FROM patient_profiles WHERE user_id = ${userId}
    `,
    'getPatientProfile'
  );
  return result?.[0] || null;
}

// ================= THERAPIST =================

export async function createTherapistProfile(userId: number, phone?: string) {
  const result = await runQuery(
    () => sql`
      INSERT INTO therapist_profiles (user_id, phone)
      VALUES (${userId}, ${phone || null})
      RETURNING *
    `,
    'createTherapistProfile'
  );
  return result?.[0] || null;
}

export async function getTherapistProfile(userId: number) {
  const result = await runQuery(
    () => sql`
      SELECT * FROM therapist_profiles WHERE user_id = ${userId}
    `,
    'getTherapistProfile'
  );
  return result?.[0] || null;
}

// ================= TREATMENT =================

export async function createTreatmentPlan(
  patientId: number,
  therapistId: number,
  title: string,
  description: string,
  startDate: string,
  endDate?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO treatment_plans (patient_id, therapist_id, title, description, start_date, end_date)
      VALUES (${patientId}, ${therapistId}, ${title}, ${description}, ${startDate}, ${endDate || null})
      RETURNING *
    `,
    'createTreatmentPlan'
  );
  return result?.[0] || null;
}

export async function getTreatmentPlansByPatient(patientId: number) {
  return await runQuery(
    () => sql`
      SELECT * FROM treatment_plans 
      WHERE patient_id = ${patientId} 
      ORDER BY created_at DESC
    `,
    'getTreatmentPlansByPatient'
  ) || [];
}

export async function getTreatmentPlanById(planId: number) {
  const result = await runQuery(
    () => sql`
      SELECT * FROM treatment_plans WHERE id = ${planId}
    `,
    'getTreatmentPlanById'
  );
  return result?.[0] || null;
}

// ================= GOALS =================

export async function createGoal(
  planId: number,
  title: string,
  description?: string,
  targetDate?: string,
  priority?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO goals (treatment_plan_id, title, description, target_date, priority)
      VALUES (${planId}, ${title}, ${description || null}, ${targetDate || null}, ${priority || 'medium'})
      RETURNING *
    `,
    'createGoal'
  );
  return result?.[0] || null;
}

export async function getGoalsByPlan(planId: number) {
  return await runQuery(
    () => sql`
      SELECT * FROM goals 
      WHERE treatment_plan_id = ${planId} 
      ORDER BY created_at DESC
    `,
    'getGoalsByPlan'
  ) || [];
}

export async function getGoalById(goalId: number) {
  const result = await runQuery(
    () => sql`
      SELECT * FROM goals WHERE id = ${goalId}
    `,
    'getGoalById'
  );
  return result?.[0] || null;
}

// ================= ACTIONS =================

export async function createAction(
  goalId: number,
  title: string,
  description?: string,
  dueDate?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO actions (goal_id, title, description, due_date)
      VALUES (${goalId}, ${title}, ${description || null}, ${dueDate || null})
      RETURNING *
    `,
    'createAction'
  );
  return result?.[0] || null;
}

export async function getActionsByGoal(goalId: number) {
  return await runQuery(
    () => sql`
      SELECT * FROM actions 
      WHERE goal_id = ${goalId} 
      ORDER BY created_at DESC
    `,
    'getActionsByGoal'
  ) || [];
}

export async function updateActionStatus(actionId: number, status: string) {
  const result = await runQuery(
    () => sql`
      UPDATE actions 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${actionId}
      RETURNING *
    `,
    'updateActionStatus'
  );
  return result?.[0] || null;
}

// ================= MOOD =================

export async function createMoodLog(
  patientId: number,
  moodScore: number,
  moodLabel?: string,
  notes?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO mood_logs (patient_id, mood_level, mood_description, notes)
      VALUES (${patientId}, ${moodScore}, ${moodLabel || null}, ${notes || null})
      RETURNING *
    `,
    'createMoodLog'
  );
  return result?.[0] || null;
}

export async function getMoodLogsByPatient(patientId: number, limit: number = 30) {
  return await runQuery(
    () => sql`
      SELECT * FROM mood_logs 
      WHERE patient_id = ${patientId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `,
    'getMoodLogsByPatient'
  ) || [];
}

// ================= NOTES =================

export async function createTherapistNote(
  patientId: number,
  therapistId: number,
  note: string,
  sessionDate?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO therapist_notes (patient_id, therapist_id, note, session_date)
      VALUES (${patientId}, ${therapistId}, ${note}, ${sessionDate || null})
      RETURNING *
    `,
    'createTherapistNote'
  );
  return result?.[0] || null;
}

export async function getTherapistNotesByPatient(patientId: number) {
  return await runQuery(
    () => sql`
      SELECT * FROM therapist_notes 
      WHERE patient_id = ${patientId}
      ORDER BY created_at DESC
    `,
    'getTherapistNotesByPatient'
  ) || [];
}

// ================= SESSIONS =================

export async function createSession(
  patientId: number,
  therapistId: number,
  sessionDate: string,
  sessionType?: string
) {
  const result = await runQuery(
    () => sql`
      INSERT INTO sessions (patient_id, therapist_id, session_date, session_type)
      VALUES (${patientId}, ${therapistId}, ${sessionDate}, ${sessionType || 'in_person'})
      RETURNING *
    `,
    'createSession'
  );
  return result?.[0] || null;
}

export async function getSessionsByPatient(patientId: number) {
  return await runQuery(
    () => sql`
      SELECT * FROM sessions 
      WHERE patient_id = ${patientId}
      ORDER BY session_date DESC
    `,
    'getSessionsByPatient'
  ) || [];
}

// ================= THERAPIST PATIENTS =================

export async function getTherapistPatients(therapistId: number) {
  return await runQuery(
    () => sql`
      SELECT DISTINCT u.* 
      FROM users u
      INNER JOIN treatment_plans tp ON u.id = tp.patient_id
      WHERE tp.therapist_id = ${therapistId}
      ORDER BY u.full_name
    `,
    'getTherapistPatients'
  ) || [];
}
