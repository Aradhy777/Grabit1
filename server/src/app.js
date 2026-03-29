const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const lectureRoutes = require('./routes/lectureRoutes');

const app = express();

// Security Middleware: Harden CORS
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());

// Security Middleware: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// Security Middleware: Internal API Key Auth
const authenticateInternal = (req, res, next) => {
  const apiKey = req.header('X-API-KEY');
  const secretKey = process.env.GRABIT_INTERNAL_API_KEY;
  
  if (!apiKey || apiKey !== secretKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
  }
  next();
};

console.log('--- BACKEND APP INITIALIZING ---');

// Health check (Open but rate-limited)
app.get('/health', limiter, (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Protected API Routes
app.use('/api', authenticateInternal, limiter, lectureRoutes);

module.exports = app;
