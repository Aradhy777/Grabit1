
const axios = require('axios');

async function testRest() {
  const apiKey = "AIzaSyAx74HsCjFlWCaui_G4zGNn_qwbMTis7Aw";
  console.log("🔍 Testing key via REST API...");

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const data = {
      contents: [{ parts: [{ text: "hello" }] }]
    };

    const res = await axios.post(url, data);
    console.log("✅ REST SUCCESS!");
    console.log("🤖 Response:", JSON.stringify(res.data.candidates[0].content.parts[0].text));
  } catch (err) {
    console.error("❌ REST FAILURE!");
    if (err.response) {
      console.error("   Status:", err.response.status);
      console.error("   Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("   Error:", err.message);
    }
  }
}

testRest();
