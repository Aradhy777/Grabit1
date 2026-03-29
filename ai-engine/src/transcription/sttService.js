const fs = require('fs');

class STTService {
  constructor() {
    this.apiKey = process.env.DEEPGRAM_API_KEY;
  }

  async transcribeStreaming(audioBuffer) {
    try {
      if (!this.apiKey || this.apiKey === 'your_deepgram_key_here') {
        console.warn('--- DEEPGRAM KEY MISSING: Falling back to Gemini for STT ---');
        return null;
      }

      // Lazy require to avoid startup crash when SDK not configured
      const sdk = require('@deepgram/sdk');
      const DeepgramClient = sdk.Deepgram || sdk.createClient;

      if (!DeepgramClient) {
        console.warn('Deepgram SDK API not recognized, falling back to Gemini');
        return null;
      }

      const deepgram = typeof DeepgramClient === 'function' && DeepgramClient.prototype
        ? new DeepgramClient(this.apiKey)
        : DeepgramClient(this.apiKey);

      const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        { model: 'nova-2', smart_format: true }
      );

      if (error) throw error;
      return result.results.channels[0].alternatives[0].transcript;
    } catch (err) {
      console.error('STT Error:', err.message);
      return null;
    }
  }
}

module.exports = new STTService();
