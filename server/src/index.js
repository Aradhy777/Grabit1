const http = require('http');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load primary server .env
dotenv.config();

// Fallback to client .env.local for GEMINI_API_KEY if needed
const clientEnvPath = path.join(__dirname, '../../client/.env.local');
if (fs.existsSync(clientEnvPath)) {
  const clientEnv = dotenv.parse(fs.readFileSync(clientEnvPath));
  if (clientEnv.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = clientEnv.GEMINI_API_KEY;
  }
}

const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = require('./app');
const { setupWebSocket } = require('./utils/ws-handler');

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.BACKEND_PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Core Brain Backend running on http://localhost:${PORT}`);
});
