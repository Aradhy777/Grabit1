const geminiService = require('../transcription/geminiService');

class LLMService {
  /**
   * Route task to the most appropriate model based on type.
   * Types: 'FAST' (Key Points), 'SMART' (Notes), 'CHAT' (Specialized)
   */
  async generate(prompt, type = 'FAST') {
    try {
      // Logic for Multi-Provider Switching
      if (type === 'FAST' && process.env.GROQ_API_KEY) {
        // TODO: Implement Groq/Llama3 for ultra-fast real-time tasks
        // For now, continue using Gemini-Flash (which is also extremely cheap)
        return await geminiService.generateFromText(prompt);
      }
      
      // Default to Gemini (Pro or Flash)
      return await geminiService.generateFromText(prompt);
    } catch (err) {
      console.error(`LLM Error [${type}]:`, err);
      throw err;
    }
  }
}

module.exports = new LLMService();
