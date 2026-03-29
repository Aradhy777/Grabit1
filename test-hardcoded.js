
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = "AIzaSyAx74HsCjFlWCaui_G4zGNn_qwbMTis7Aw";
  console.log("🔍 Testing HARDCODED key...");
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    const response = await result.response;
    console.log("✅ SUCCESS! Hardcoded key works.");
    console.log("🤖 Response:", response.text());
  } catch (e) {
    console.error("❌ FAILURE! Hardcoded key still fails.");
    console.error("   Error:", e.message);
  }
}

test();
