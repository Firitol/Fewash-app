#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runSetup() {
  try {
    console.log('🚀 Starting Relief-Zone database setup...\n');
    
    // Read and execute migration
    console.log('📦 Creating database tables...');
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      try {
        await sql(statement);
        successCount++;
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          skipCount++;
        } else {
          console.error(`❌ Error: ${error.message}`);
          throw error;
        }
      }
    }
    
    console.log(`✓ Tables ready (Created: ${successCount}, Skipped: ${skipCount})\n`);

    // Seed chill zone resources
    console.log('🧘 Seeding chill zone resources...');
    const resources = [
      {
        title_en: 'Guided Meditation - 10 Minutes',
        title_am: '10 ደቂቃ የሚወስደው መመሪያ ታሳሳቢ',
        title_or: 'Sagantummaa Fudhachuu - Daqiqa 10',
        description_en: 'A calming guided meditation to reduce stress and anxiety',
        description_am: 'ጭንቀት እና ስሜታዊ ግርግር ለመቀነስ የሚያስገድድ ታሳሳቢ',
        description_or: 'Cunqorfamaa hir\'ina itti cimmee jajjabsuuf',
        category: 'meditation',
        duration_minutes: 10
      },
      {
        title_en: 'Box Breathing Exercise',
        title_am: 'ሳጥን ሳንሳ ልምምድ',
        title_or: 'Shamaraa Jiidha Kuubik',
        description_en: '4-4-4-4 breathing technique for instant calm',
        description_am: 'ቅዳሴ ሰላም ለአፋጣኝ 4-4-4-4 ሳንሳ ዘዴ',
        description_or: 'Qajeelfama jiidha 4-4-4-4 itti ilaalamummaa godhachuu',
        category: 'breathing',
        duration_minutes: 5
      },
      {
        title_en: '4-7-8 Breathing Technique',
        title_am: '4-7-8 ሳንሳ ዘዴ',
        title_or: 'Qajeelfama Jiidha 4-7-8',
        description_en: 'Deep breathing technique to promote relaxation and better sleep',
        description_am: 'ስሕተት ለማግኘት ጥልቀት ያለበት ሳንሳ ዘዴ',
        description_or: 'Qajeelfama jiidha gadi yeroo laalamummaa barachuu',
        category: 'breathing',
        duration_minutes: 8
      },
      {
        title_en: 'Morning Mindfulness',
        title_am: 'ወደ ቁም ነገር ንግግር ማታ',
        title_or: 'Beekumsa Ganama',
        description_en: 'Start your day with positive affirmations and mindfulness',
        description_am: 'ቀንህን በኃላፊነት ጣቅሳ ጀምር',
        description_or: 'Guyyaa kee jalala gaaffiin jalqab',
        category: 'meditation',
        duration_minutes: 12
      },
      {
        title_en: 'Progressive Muscle Relaxation',
        title_am: 'የተወሰነ ጡንቻ ዓረፍተ ነገር',
        title_or: 'Yaadannoo Jiidha Tilmaamuu',
        description_en: 'Tense and release muscle groups for deep relaxation',
        description_am: 'ጡንቻ ቡድን በታቅዓ እና መልቀቅ ለጥልቀት ዓረፍተ ነገር',
        description_or: 'Jiidha jidha miidha keessaa jalala ilaalchuu',
        category: 'relaxation',
        duration_minutes: 15
      },
      {
        title_en: 'Body Scan Meditation',
        title_am: 'የሰውነት ስክን ታሳሳቢ',
        title_or: 'Fijjii Jidha Yaada Jalala',
        description_en: 'Scan your body from head to toe to release tension',
        description_am: 'ሰውነትህን ከወገብ እስከ እግር ስክን ጋር ተፈትሽ',
        description_or: 'Jidhaan kee jalqabee hanga miilla sanani fijii',
        category: 'meditation',
        duration_minutes: 20
      },
      {
        title_en: 'Gratitude Meditation',
        title_am: 'ምስጋና ታሳሳቢ',
        title_or: 'Yaada Galateeffannaa',
        description_en: 'Cultivate gratitude and positive emotions',
        description_am: 'ምስጋና እና 긍정적 ስሜታዊ መንገድ ማዳበር',
        description_or: 'Galateeffannaa fi miidha gaaffiin barachuu',
        category: 'meditation',
        duration_minutes: 10
      },
      {
        title_en: 'Nature Sounds - Forest',
        title_am: 'ተፈጥሮ ድምጽ - ደን',
        title_or: 'Sagantummaa Uumatta - Dirirsa',
        description_en: 'Relaxing nature sounds from a peaceful forest',
        description_am: 'ደን ላይ ተሰላችህ ተፈጥሮ ድምጽ',
        description_or: 'Sagantummaa uumatta dirirsa jalala irraa',
        category: 'relaxation',
        duration_minutes: 30
      }
    ];

    for (const resource of resources) {
      try {
        await sql`
          INSERT INTO chill_zone_resources 
          (title_english, title_amharic, title_oromo, description_english, description_amharic, description_oromo, category, duration_minutes)
          VALUES (${resource.title_en}, ${resource.title_am}, ${resource.title_or}, ${resource.description_en}, ${resource.description_am}, ${resource.description_or}, ${resource.category}, ${resource.duration_minutes})
          ON CONFLICT DO NOTHING
        `;
      } catch (error) {
        console.error(`Failed to insert resource: ${resource.title_en}`, error.message);
      }
    }

    console.log(`✓ Seeded ${resources.length} chill zone resources\n`);

    console.log('✅ Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Clear your browser cache');
    console.log('2. Restart the development server (npm run dev)');
    console.log('3. Try registering a new account\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

runSetup();
