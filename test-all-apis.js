
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testApi(name, method, endpoint, data = null) {
  console.log(`\n🧪 Testing ${name} [${method} ${endpoint}]...`);
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      data: method === 'POST' ? data : null
    };
    
    const start = Date.now();
    const res = await axios(config);
    const duration = Date.now() - start;
    
    console.log(`✅ ${name} working! (${duration}ms)`);
  } catch (err) {
    console.error(`❌ ${name} failed!`);
    if (err.response) {
      console.error(`   Status: ${err.response.status}`);
      console.error(`   Message:`, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(`   Error: ${err.message}`);
    }
  }
}

async function runTests() {
  console.log('🚀 Starting Full API Health Check...\n');

  // Simple GET APIs (No Gemini)
  await testApi('User Profile', 'GET', '/api/user');
  await testApi('Library', 'GET', '/api/library');

  // Gemini-dependent APIs
  const mockTranscript = "The topic of today's lecture is photosynthesis. Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.";

  await testApi('Notes Generation', 'POST', '/api/notes', { transcript: mockTranscript });
  await testApi('Highlights Extraction', 'POST', '/api/highlights', { transcript: mockTranscript });
  await testApi('AI Chat Assistant', 'POST', '/api/chat', { transcript: mockTranscript, question: "What is photosynthesis?" });

  console.log('\n🏁 Tests Finished.');
}

runTests();
