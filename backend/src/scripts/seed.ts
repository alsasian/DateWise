import pool from '../config/database';
import { ActivityCategory } from '../types';

interface ActivitySeed {
  name: string;
  category: ActivityCategory;
  icon: string;
  description: string;
  country: 'singapore' | 'indonesia' | 'both';
}

const activities: ActivitySeed[] = [
  // ☕ Coffee & Casual
  {
    name: 'Coffee at specialty café',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '☕',
    description: 'Meet for coffee at a cozy specialty café',
    country: 'both'
  },
  {
    name: 'Coffee at Tiong Bahru',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '☕',
    description: 'Explore the hip cafés in Tiong Bahru neighborhood',
    country: 'singapore'
  },
  {
    name: 'Coffee at Common Man Coffee Roasters',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '☕',
    description: 'Great coffee spot in various Singapore locations',
    country: 'singapore'
  },
  {
    name: 'Bubble tea walk',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '🧋',
    description: 'Grab bubble tea and take a casual walk',
    country: 'both'
  },
  {
    name: 'Brunch at Haji Lane',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '🥐',
    description: 'Brunch in the colorful Haji Lane area',
    country: 'singapore'
  },
  {
    name: 'Coffee at Senopati',
    category: ActivityCategory.COFFEE_CASUAL,
    icon: '☕',
    description: 'Trendy coffee spots in Senopati, Jakarta',
    country: 'indonesia'
  },

  // 🌳 Outdoor & Active
  {
    name: 'MacRitchie Reservoir walk',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🌲',
    description: 'Scenic nature walk around MacRitchie Reservoir',
    country: 'singapore'
  },
  {
    name: 'East Coast Park cycling',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🚴',
    description: 'Rent bikes and cycle along the coast',
    country: 'singapore'
  },
  {
    name: 'Botanical Gardens stroll',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🌺',
    description: 'Peaceful walk through Singapore Botanic Gardens',
    country: 'singapore'
  },
  {
    name: 'Bukit Timah hiking',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '⛰️',
    description: 'Hike up Singapore\'s highest natural peak',
    country: 'singapore'
  },
  {
    name: 'Sentosa beach walk',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🏖️',
    description: 'Walk along Sentosa beaches',
    country: 'singapore'
  },
  {
    name: 'Gardens by the Bay',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🌳',
    description: 'Explore the iconic Supertree Grove and gardens',
    country: 'singapore'
  },
  {
    name: 'Ancol Beach walk',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🏖️',
    description: 'Stroll along Ancol beach in Jakarta',
    country: 'indonesia'
  },
  {
    name: 'Ubud rice terrace walk',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🌾',
    description: 'Walk through beautiful Tegalalang rice terraces',
    country: 'indonesia'
  },
  {
    name: 'Mount Batur sunrise hike',
    category: ActivityCategory.OUTDOOR_ACTIVE,
    icon: '🌄',
    description: 'Early morning hike to see sunrise from Mount Batur',
    country: 'indonesia'
  },

  // 🍽️ Food & Dining
  {
    name: 'Try new restaurant',
    category: ActivityCategory.FOOD_DINING,
    icon: '🍽️',
    description: 'Explore a new restaurant together',
    country: 'both'
  },
  {
    name: 'Hawker center food tour',
    category: ActivityCategory.FOOD_DINING,
    icon: '🍜',
    description: 'Sample diverse local food at hawker centers',
    country: 'singapore'
  },
  {
    name: 'Dessert café',
    category: ActivityCategory.FOOD_DINING,
    icon: '🍰',
    description: 'Meet at a dessert café for sweet treats',
    country: 'both'
  },
  {
    name: 'Cooking class together',
    category: ActivityCategory.FOOD_DINING,
    icon: '👨‍🍳',
    description: 'Learn to cook a new cuisine together',
    country: 'both'
  },
  {
    name: 'Dimsum brunch',
    category: ActivityCategory.FOOD_DINING,
    icon: '🥟',
    description: 'Weekend dimsum at popular spots',
    country: 'singapore'
  },
  {
    name: 'Satay at Lau Pa Sat',
    category: ActivityCategory.FOOD_DINING,
    icon: '�串',
    description: 'Evening satay street at Lau Pa Sat',
    country: 'singapore'
  },
  {
    name: 'Rooftop dining Marina Bay',
    category: ActivityCategory.FOOD_DINING,
    icon: '🌆',
    description: 'Dinner with a view at Marina Bay rooftops',
    country: 'singapore'
  },
  {
    name: 'Warung Nasi Padang',
    category: ActivityCategory.FOOD_DINING,
    icon: '🍛',
    description: 'Authentic Indonesian cuisine experience',
    country: 'indonesia'
  },
  {
    name: 'Jakarta street food tour',
    category: ActivityCategory.FOOD_DINING,
    icon: '🍜',
    description: 'Explore Jakarta\'s vibrant street food scene',
    country: 'indonesia'
  },
  {
    name: 'Seafood dinner at Jimbaran',
    category: ActivityCategory.FOOD_DINING,
    icon: '🦞',
    description: 'Fresh seafood on the beach in Bali',
    country: 'indonesia'
  },

  // 🎨 Arts & Culture
  {
    name: 'National Gallery visit',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🖼️',
    description: 'Explore Southeast Asian art at National Gallery',
    country: 'singapore'
  },
  {
    name: 'ArtScience Museum',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🎨',
    description: 'Interactive exhibits at ArtScience Museum',
    country: 'singapore'
  },
  {
    name: 'Asian Civilisations Museum',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🏛️',
    description: 'Discover Asian cultural heritage',
    country: 'singapore'
  },
  {
    name: 'Bookstore browsing',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '📚',
    description: 'Browse books at BooksActually or other indie bookstores',
    country: 'both'
  },
  {
    name: 'Live music at Esplanade',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🎵',
    description: 'Enjoy live performances at Esplanade',
    country: 'singapore'
  },
  {
    name: 'Chinatown Heritage Centre',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🏮',
    description: 'Learn about Singapore\'s Chinese immigrant history',
    country: 'singapore'
  },
  {
    name: 'Museum MACAN',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🎨',
    description: 'Modern and contemporary art museum in Jakarta',
    country: 'indonesia'
  },
  {
    name: 'Ubud Art Market',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '🛍️',
    description: 'Browse local art and crafts in Ubud',
    country: 'indonesia'
  },
  {
    name: 'Traditional dance performance',
    category: ActivityCategory.ARTS_CULTURE,
    icon: '💃',
    description: 'Watch traditional Balinese or Javanese dance',
    country: 'indonesia'
  },

  // 🎯 Fun & Games
  {
    name: 'Board game café',
    category: ActivityCategory.FUN_GAMES,
    icon: '🎲',
    description: 'Play board games at a cozy café',
    country: 'both'
  },
  {
    name: 'Arcade gaming',
    category: ActivityCategory.FUN_GAMES,
    icon: '🕹️',
    description: 'Retro arcade games or modern gaming',
    country: 'both'
  },
  {
    name: 'Escape room',
    category: ActivityCategory.FUN_GAMES,
    icon: '🔐',
    description: 'Solve puzzles together in an escape room',
    country: 'both'
  },
  {
    name: 'Mini golf',
    category: ActivityCategory.FUN_GAMES,
    icon: '⛳',
    description: 'Fun mini golf competition',
    country: 'both'
  },
  {
    name: 'Bowling',
    category: ActivityCategory.FUN_GAMES,
    icon: '🎳',
    description: 'Casual bowling game',
    country: 'both'
  },
  {
    name: 'Laser tag',
    category: ActivityCategory.FUN_GAMES,
    icon: '🔫',
    description: 'Action-packed laser tag game',
    country: 'both'
  },
  {
    name: 'Sentosa attractions',
    category: ActivityCategory.FUN_GAMES,
    icon: '🎢',
    description: 'Universal Studios, aquarium, or other Sentosa fun',
    country: 'singapore'
  },
  {
    name: 'Timezone arcade',
    category: ActivityCategory.FUN_GAMES,
    icon: '🎮',
    description: 'Popular arcade chain in Indonesia',
    country: 'indonesia'
  },

  // 🎭 Entertainment
  {
    name: 'Movie at cinema',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🎬',
    description: 'Watch the latest movie together',
    country: 'both'
  },
  {
    name: 'Theater performance',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🎭',
    description: 'Watch a play or musical',
    country: 'both'
  },
  {
    name: 'Comedy show',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '😄',
    description: 'Laugh together at a comedy show',
    country: 'both'
  },
  {
    name: 'Live music venue',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🎸',
    description: 'Enjoy live music at bars or venues',
    country: 'both'
  },
  {
    name: 'Karaoke session',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🎤',
    description: 'Private room karaoke fun',
    country: 'both'
  },
  {
    name: 'Jazz bar at Boat Quay',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🎺',
    description: 'Smooth jazz by the river',
    country: 'singapore'
  },
  {
    name: 'Night Safari',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🦁',
    description: 'Unique nocturnal zoo experience',
    country: 'singapore'
  },
  {
    name: 'River Safari',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🐼',
    description: 'See pandas and river wildlife',
    country: 'singapore'
  },
  {
    name: 'Marina Bay light show',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '✨',
    description: 'Free light and water show at Marina Bay Sands',
    country: 'singapore'
  },
  {
    name: 'Rooftop bar hopping',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🍸',
    description: 'Visit trendy rooftop bars with city views',
    country: 'both'
  },
  {
    name: 'SCBD nightlife',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🌃',
    description: 'Explore Jakarta\'s upscale nightlife district',
    country: 'indonesia'
  },
  {
    name: 'Seminyak beach clubs',
    category: ActivityCategory.ENTERTAINMENT,
    icon: '🍹',
    description: 'Sunset at Bali beach clubs',
    country: 'indonesia'
  },
];

async function seedActivities() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting activity seed...');

    // Check if activities already exist
    const existingCount = await client.query('SELECT COUNT(*) FROM activities');
    if (parseInt(existingCount.rows[0].count) > 0) {
      console.log('⚠️  Activities already seeded. Skipping...');
      return;
    }

    // Insert activities
    for (const activity of activities) {
      await client.query(
        `INSERT INTO activities (name, category, icon, description, country)
         VALUES ($1, $2, $3, $4, $5)`,
        [activity.name, activity.category, activity.icon, activity.description, activity.country]
      );
    }

    console.log(`✅ Successfully seeded ${activities.length} activities`);

    // Show summary by category
    const summary = await client.query(`
      SELECT category, COUNT(*) as count
      FROM activities
      GROUP BY category
      ORDER BY category
    `);

    console.log('\n📊 Activities by category:');
    summary.rows.forEach(row => {
      console.log(`   ${row.category}: ${row.count}`);
    });

    // Show summary by country
    const countrySummary = await client.query(`
      SELECT country, COUNT(*) as count
      FROM activities
      GROUP BY country
      ORDER BY country
    `);

    console.log('\n🌏 Activities by country:');
    countrySummary.rows.forEach(row => {
      console.log(`   ${row.country}: ${row.count}`);
    });

  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedActivities()
    .then(() => {
      console.log('\n✨ Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed:', error);
      process.exit(1);
    });
}

export default seedActivities;
