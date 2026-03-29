
const axios = require('axios');

async function listModelsRest() {
  const apiKey = "AIzaSyAx74HsCjFlWCaui_G4zGNn_qwbMTis7Aw";
  console.log("🔍 Fetching models via REST API...");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await axios.get(url);
    console.log("✅ SUCCESS!");
    console.log("🤖 Available Models:");
    res.data.models.forEach(m => console.log(`   - ${m.name}`));
  } catch (err) {
    console.error("❌ FAILURE!");
    if (err.response) {
      console.error("   Status:", err.response.status);
      console.error("   Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("   Error:", err.message);
    }
  }
}

listModelsRest();
