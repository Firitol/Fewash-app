import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const chillZoneResources = [
  // Amharic Resources
  {
    title: 'የታሠረ ማንቆትና ዝለት',
    description: 'የ10 ደቂቃ ለስተኛ ዝለት መልመጃ ሳሪ ሌላዎች እና አእምሮአ ለ ተረጋጋ ሠሪነት',
    type: 'relaxation',
    duration_minutes: 10,
    difficulty_level: 'beginner',
    language: 'amharic',
  },
  {
    title: 'ማግኘት እና ማስተዋወቅ ታሠር',
    description: 'ሊቀ-ስእሉ ያሉ ትንፋሾ መልመጃዎች ሌላዎች እና አእምሮአ ለ ተረጋጋ ግርግር.',
    type: 'breathing_exercise',
    duration_minutes: 5,
    difficulty_level: 'beginner',
    language: 'amharic',
  },
  {
    title: 'የምሽት ያሸግል ያሸግል',
    description: 'ለሌሊት ያሸግል የ20 ደቂቃ ተግባር, የታሠረ ማንቆትና ዝለት ከተግባር.',
    type: 'meditation',
    duration_minutes: 20,
    difficulty_level: 'beginner',
    language: 'amharic',
  },
  {
    title: 'ጥልቅ ትንፋሾ ያሸግል',
    description: 'ግርግር ነውጥ ለማስተናገድ ጥልቅ ትንፋሾ መልመጃ.',
    type: 'breathing_exercise',
    duration_minutes: 8,
    difficulty_level: 'beginner',
    language: 'amharic',
  },
  {
    title: 'የዘ ኑዋ ግንዛበ',
    description: 'የ15 ደቂቃ ግንዛበ ሎሞ, ኢ-ሃሳብ እና ተመልካሚነት.',
    type: 'mindfulness',
    duration_minutes: 15,
    difficulty_level: 'intermediate',
    language: 'amharic',
  },
  {
    title: 'ከተወሰዱ ብራዥ ያሸግል',
    description: 'ለተዋክቷ ሌላዎች: ከ25 ደቂቃ የደረ ዝለት መልመጃ.',
    type: 'relaxation',
    duration_minutes: 25,
    difficulty_level: 'intermediate',
    language: 'amharic',
  },

  // Afan Oromo Resources
  {
    title: 'Midhaa Yeroo Sadii Irratti',
    description: 'Hojiirri midhaa 10 daqiiqaa kan jiidha fi sammuu midir gochuu.',
    type: 'relaxation',
    duration_minutes: 10,
    difficulty_level: 'beginner',
    language: 'afan_oromo',
  },
  {
    title: 'Af-iniinsuu Midir',
    description: 'Hojiirri af-iniinsuu 5 daqiiqaa kan midhaa gara midir gochuu.',
    type: 'breathing_exercise',
    duration_minutes: 5,
    difficulty_level: 'beginner',
    language: 'afan_oromo',
  },
  {
    title: 'Yaadannoo Habash',
    description: 'Yaadannoo 20 daqiiqaa kan gannewa gargaara fi midhaa gochuu.',
    type: 'meditation',
    duration_minutes: 20,
    difficulty_level: 'beginner',
    language: 'afan_oromo',
  },
  {
    title: 'Af-iniinsuu Miidhe',
    description: 'Hojiirra af-iniinsuu miidhe fudhatinsa wal qabachuu keessatti gargaara.',
    type: 'breathing_exercise',
    duration_minutes: 8,
    difficulty_level: 'beginner',
    language: 'afan_oromo',
  },
  {
    title: 'Waan Yaaduu Midir',
    description: 'Hojiirri waan yaaduu 15 daqiiqaa kan sammuu midir kan gochuu.',
    type: 'mindfulness',
    duration_minutes: 15,
    difficulty_level: 'intermediate',
    language: 'afan_oromo',
  },
  {
    title: 'Midhaa Giddu Galeessa',
    description: 'Hojiirri midhaa 25 daqiiqaa kan sammuu midir kan gochuu.',
    type: 'relaxation',
    duration_minutes: 25,
    difficulty_level: 'intermediate',
    language: 'afan_oromo',
  },
];

async function seedChillZone() {
  try {
    console.log('Starting to seed chill zone resources...');

    for (const resource of chillZoneResources) {
      try {
        await sql`
          INSERT INTO chill_zone_resources (title, description, type, duration_minutes, difficulty_level, language, is_active)
          VALUES (${resource.title}, ${resource.description}, ${resource.type}, ${resource.duration_minutes}, ${resource.difficulty_level}, ${resource.language}, true)
        `;
        console.log(`✓ Added: ${resource.title}`);
      } catch (error) {
        // Ignore duplicate errors
        if (!error.message.includes('already exists')) {
          console.error(`Error adding resource: ${error.message}`);
        }
      }
    }

    console.log('✓ Chill zone resources seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedChillZone();
