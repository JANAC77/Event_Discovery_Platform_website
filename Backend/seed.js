require('dotenv').config();
const connectDB = require('./config/db');
const Event = require('./models/Event');
const seedData = require('./seedData');

const runSeed = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing event records...');
    await Event.deleteMany({});
    
    console.log('[Seed] Inserting seed events...');
    const createdEvents = await Event.insertMany(seedData);
    console.log(`[Seed] Successfully seeded ${createdEvents.length} events!`);
    
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    process.exit(1);
  }
};

runSeed();
