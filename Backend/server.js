require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Event = require('./models/Event');
const seedData = require('./seedData');

const app = express();

// Middleware
app.use(cors());

// Increase body parser limits for large Base64 image payloads (up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded image files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log incoming HTTP requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Event Discovery Platform Backend API is online',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint Not Found: ${req.method} ${req.url}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if collection is empty
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] Database is empty. Seeding initial event dataset...');
      await Event.insertMany(seedData);
      console.log(`[Auto-Seed] Successfully seeded ${seedData.length} initial events.`);
    }

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  Event Discovery Platform API Server Running!  `);
      console.log(`  Port: http://localhost:${PORT}                `);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Events API: http://localhost:${PORT}/api/events `);
      console.log(`  Upload API: http://localhost:${PORT}/api/upload `);
      console.log(`  Body Limit: 50MB (Base64 Ready)               `);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
