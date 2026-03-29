const { WebSocketServer } = require('ws');
const aiService = require('../services/aiService');

const clients = new Set();
let transcriptContext = "";
let lastConceptLength = 0;

const url = require('url');

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true).query;
    const authKey = parameters.auth;
    const secretKey = process.env.GRABIT_INTERNAL_API_KEY || 'grabit_secret_auth_2026';

    if (!authKey || authKey !== secretKey) {
      console.warn('❌ Unauthorized WebSocket connection attempt');
      ws.close(4001, 'Unauthorized');
      return;
    }

    clients.add(ws);
    console.log('🟢 WebSocket Client authenticated and connected');

    ws.on('message', async (message) => {
      try {
        if (typeof message === 'string' || Buffer.isBuffer(message)) {
          try {
            const data = JSON.parse(message.toString());
            if (data.type === 'init') {
              ws.role = data.role;
              ws.topic = data.topic;
              console.log(`👤 Client assigned role: ${ws.role} | Topic: ${ws.topic || 'none'}`);
              return;
            }
          } catch (e) {}
        }

        if (ws.role === 'teacher') {
          const audioBase64 = Buffer.from(message).toString('base64');
          const text = await aiService.processTranscription(audioBase64, transcriptContext);

          if (text) {
            transcriptContext += (transcriptContext ? " " : "") + text;
            
            // Broadcast Transcript
            const transcriptPayload = JSON.stringify({ type: 'transcript', content: text });
            clients.forEach(client => {
              if (client.readyState === 1) client.send(transcriptPayload);
            });

            // Smart Concept Extraction (Every ~300 chars)
            if (transcriptContext.length - lastConceptLength > 300) {
              const segment = transcriptContext.slice(lastConceptLength);
              lastConceptLength = transcriptContext.length;
              
              console.log('--- EXTRACTING KEY CONCEPT ---');
              try {
                const concept = await aiService.extractKeyPoint(segment);
                if (concept && concept.length > 10) {
                   const conceptPayload = JSON.stringify({ type: 'keypoint', content: concept });
                   clients.forEach(client => {
                     if (client.readyState === 1) client.send(conceptPayload);
                   });
                }
              } catch (err) {
                console.error('Key Point Extraction Error:', err.message);
              }
            }
          }
        }
      } catch (err) {
        console.error('❌ WebSocket error:', err.message);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('🔴 WebSocket Client disconnected');
    });
  });
}

module.exports = { setupWebSocket };
