
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testVerbose() {
  const apiKey = "AIzaSyAx74HsCjFlWCaui_G4zGNn_qwbMTis7Aw";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  
  for (const m of models) {
    console.log(`\n🧪 Testing model: ${m}`);
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("ping");
      const resp = await result.response;
      console.log(`✅ ${m} WORKS:`, resp.text());
      return; // Exit if any work
    } catch (e) {
      console.log(`❌ ${m} FAILED`);
      console.log(`   Message: ${e.message}`);
      if (e.response) {
        console.log(`   Status: ${e.response.status}`);
        console.log(`   Data:`, JSON.stringify(e.response.data, null, 2));
      }
    }
  }
}

testVerbose();
