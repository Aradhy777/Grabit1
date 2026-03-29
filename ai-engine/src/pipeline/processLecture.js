const geminiService = require('../transcription/geminiService');
const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, '../prompts');
const getPrompt = (name) => fs.readFileSync(path.join(promptsDir, `${name}.txt`), 'utf8');

async function processStreamingAudio(audioBase64, context = "") {
  let prompt = getPrompt('filteringPrompt');
  prompt = prompt.replace('{{context}}', context.slice(-400));
  
  return await geminiService.transcribeAudio(audioBase64, prompt);
}

async function finalizeNotes(transcript) {
  let prompt = getPrompt('notesPrompt');
  prompt = prompt.replace('{{transcript}}', transcript);
  
  return await geminiService.generateFromText(prompt);
}

module.exports = {
  processStreamingAudio,
  finalizeNotes
};
