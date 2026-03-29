const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async transcribeAudio(audioBase64, prompt) {
    const result = await this.model.generateContent([
      { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
      prompt
    ]);
    return (await result.response).text().trim();
  }

  async generateFromText(prompt) {
    const result = await this.model.generateContent(prompt);
    return (await result.response).text().trim();
  }
}

module.exports = new GeminiService();
