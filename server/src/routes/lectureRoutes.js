const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Validation Middleware
const validateTranscript = (req, res, next) => {
  console.log('--- VALIDATING TRANSCRIPT ---', typeof req.body);
  const { transcript } = req.body || {};
  if (!transcript || typeof transcript !== 'string') {
    console.warn('--- INVALID TRANSCRIPT ---');
    return res.status(400).json({ error: 'Invalid transcript: must be a string' });
  }
  if (transcript.length > 50000) { 
    return res.status(400).json({ error: 'Transcript too large' });
  }
  next();
};

const validateChat = (req, res, next) => {
  const { transcript, question } = req.body || {};
  if (!transcript || !question) {
    return res.status(400).json({ error: 'Missing transcript or question' });
  }
  if (transcript.length > 50000 || question.length > 1000) {
    return res.status(400).json({ error: 'Request too large' });
  }
  next();
};

router.post('/notes', validateTranscript, async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const notes = await aiService.generateNotes(transcript);
    res.json({ notes });
  } catch (err) {
    next(err); 
  }
});

router.post('/highlights', validateTranscript, async (req, res, next) => {
  try {
    const { transcript } = req.body;
    const highlights = await aiService.generateHighlights(transcript);
    res.json({ highlights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', validateChat, async (req, res) => {
  try {
    const { transcript, question } = req.body;
    const answer = await aiService.chatWithTranscript(transcript, question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const lectureService = require('../services/lectureService');

// ... (previous routes)

router.get('/lectures', async (req, res) => {
  try {
    const lectures = await lectureService.getAllLectures();
    res.json({ lectures });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/publish', async (req, res) => {
  try {
    const lecture = await lectureService.saveLecture(req.body);
    res.json({ success: true, lecture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
