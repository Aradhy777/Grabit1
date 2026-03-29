
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function getApiKey() {
  const envPath = path.join(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/GEMINI_API_KEY=(.+)/);
  return match ? match[1].trim() : null;
}

async function listModels() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("🔍 Fetching available models...");
    // The listModels method might not be directly on genAI in some SDK versions, 
    // but we can try to find where it is or check properties.
    // Actually, usually it's genAI.getGenerativeModel({ model: "..." }) 
    // but to list we might need a different approach or just test 1.0 vs 1.5.
    
    // Let's try to test a few common model names to see what sticks.
    const modelsToTest = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        await result.response;
        console.log(`✅ Model ${modelName} is AVAILABLE`);
      } catch (e) {
        console.log(`❌ Model ${modelName} failed: ${e.message}`);
      }
    }

  } catch (e) {
    console.error("❌ ERROR listing models:", e.message);
  }
}

listModels();
