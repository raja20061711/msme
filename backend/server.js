const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Connect to MongoDB (with automatic local/in-memory fallback)
connectDB();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SECUREMSME AI Express Backend API',
    timestamp: new Date().toISOString(),
    version: '1.0.0-prototype'
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Requested API endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Backend Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server processing error.',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`SECUREMSME AI Backend Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});
