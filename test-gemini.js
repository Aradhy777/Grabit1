
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function getApiKey() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env.local file not found at", envPath);
    return null;
  }
  
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/GEMINI_API_KEY=(.+)/);
  return match ? match[1].trim() : null;
}

async function verify() {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY not found in .env.local");
    return;
  }

  console.log(`🔍 testing key: [${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}]`);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log("⏳ sending request...");
    const result = await model.generateContent("Test.");
    const response = await result.response;
    
    console.log("✅ API IS WORKING!");
    console.log("🤖 response:", response.text());
  } catch (e) {
    console.error("❌ API ERROR:", e.message);
  }
}

verify();
