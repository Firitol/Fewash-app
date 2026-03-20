import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration() {
  try {
    console.log('Starting database migration for Relief-zone...');
    
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    // Split by semicolon and filter out empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        const preview = statement.substring(0, 50).replace(/\n/g, ' ');
        console.log(`Executing: ${preview}...`);
        await sql(statement);
        successCount++;
      } catch (error) {
        // Ignore "already exists" errors for idempotency
        if (error.message && error.message.includes('already exists')) {
          console.log(`  ℹ Skipped (already exists)`);
          successCount++;
        } else {
          console.error(`  ✗ Error: ${error.message}`);
          errorCount++;
        }
      }
    }
    
    console.log(`\n✓ Database migration completed!`);
    console.log(`  Successful: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
