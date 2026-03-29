const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  transcript: { type: String, required: true },
  notes: { type: String },
  subject: { type: String, default: 'General' },
  duration: { type: String },
  confidence: { type: Number, default: 100 },
  type: { type: String, default: 'lecture' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lecture', LectureSchema);
