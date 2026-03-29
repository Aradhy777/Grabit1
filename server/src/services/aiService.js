const sttService = require('../../../ai-engine/src/transcription/sttService');
const llmService = require('../../../ai-engine/src/analysis/llmService');
const processLecture = require('../../../ai-engine/src/pipeline/processLecture');
const fs = require('fs');
const path = require('path');

const getPrompt = (name) => fs.readFileSync(path.join(__dirname, `../../../ai-engine/src/prompts/${name}.txt`), 'utf8');

class AIService {
  async processTranscription(audioBase64, previousContext = "") {
    // If Deepgram is configured, use it for STT to save costs
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const transcription = await sttService.transcribeStreaming(audioBuffer);
    
    if (transcription) {
      return transcription;
    }
    
    // Fallback to Gemini if STT service is not configured
    return await processLecture.processStreamingAudio(audioBase64, previousContext);
  }

  async generateNotes(transcript) {
    // Route large document summarization to the 'SMART' tier
    return await processLecture.finalizeNotes(transcript);
  }

  async extractKeyPoint(segment) {
    const prompt = getPrompt('keyPointPrompt').replace('{{segment}}', segment);
    return await llmService.generate(prompt, 'FAST');
  }

  async generateHighlights(transcript) {
    const prompt = `Extract top 5-7 key takeaways/highlights from this lecture transcript: ${transcript}`;
    return await llmService.generate(prompt, 'FAST');
  }

  async chatWithTranscript(transcript, question) {
    const prompt = `As an expert academic assistant, answer this question based ONLY on the provided lecture transcript. 
    Transcript: ${transcript}
    Question: ${question}`;
    return await llmService.generate(prompt, 'SMART');
  }
}

module.exports = new AIService();
