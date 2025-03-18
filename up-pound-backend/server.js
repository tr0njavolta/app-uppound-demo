const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const socketIo = require('socket.io');

// Create Express app
const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all origins (for demo purposes)
app.use(cors({
  origin: '*', // In production, you would specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@database:5432/uppound'
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads directory for accessing pet images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Log all requests to help with debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Get all pets
app.get('/api/pets', async (req, res) => {
  try {
    console.log('Fetching all pets from database');
    const result = await pool.query('SELECT * FROM pets');
    console.log(`Found ${result.rows.length} pets`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying pets:', err);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// Get pet by ID
app.get('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching pet with ID: ${id}`);
    const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log(`Pet with ID ${id} not found`);
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    console.log(`Found pet: ${result.rows[0].name}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching pet with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new pet (admin functionality)
app.post('/api/pets', upload.single('image'), async (req, res) => {
  try {
    const { name, species, breed, age, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      'INSERT INTO pets (name, species, breed, age, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, breed, age, description, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

// Submit adoption application
app.post('/api/adoptions', async (req, res) => {
  try {
    const { pet_id, applicant_name, email, phone, message } = req.body;
    
    // First check if the pet exists
    const petCheck = await pool.query('SELECT id FROM pets WHERE id = $1', [pet_id]);
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    const result = await pool.query(
      'INSERT INTO adoptions (pet_id, applicant_name, email, phone, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pet_id, applicant_name, email, phone, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating adoption application:', err);
    res.status(500).json({ error: 'Failed to submit adoption application' });
  }
});

// Get adoption applications (admin functionality)
app.get('/api/adoptions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as pet_name, p.species, p.breed
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.id
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching adoptions:', err);
    res.status(500).json({ error: 'Failed to fetch adoption applications' });
  }
});

// Search pets endpoint
app.get('/api/pets/search', async (req, res) => {
  try {
    const { query, species } = req.query;
    
    let sqlQuery = 'SELECT * FROM pets WHERE 1=1';
    const params = [];
    
    if (query) {
      params.push(`%${query}%`);
      sqlQuery += ` AND (name ILIKE $${params.length} OR breed ILIKE $${params.length})`;
    }
    
    if (species) {
      params.push(species);
      sqlQuery += ` AND species = $${params.length}`;
    }
    
    const result = await pool.query(sqlQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching pets:', err);
    res.status(500).json({ error: 'Failed to search pets' });
  }
});

// Default route handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api/pets`);
});

// Set up Socket.IO for real-time updates (optional for demo)
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow connections from any origin for demo purposes
    methods: ["GET", "POST"]
  }
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // When a new adoption is submitted, broadcast to all clients
  socket.on('new_adoption', (data) => {
    io.emit('adoption_update', data);
  });
  
  // When a client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});

module.exports = { app, server };
