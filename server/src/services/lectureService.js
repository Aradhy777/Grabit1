const mongoose = require('mongoose');

const Lecture = require('../models/Lecture');

class LectureService {
  async getAllLectures() {
    try {
      return await Lecture.find().sort({ createdAt: -1 });
    } catch (err) {
      console.error('Error reading lectures:', err);
      return [];
    }
  }

  async saveLecture(lectureData) {
    try {
      const lecture = new Lecture(lectureData);
      return await lecture.save();
    } catch (err) {
      console.error('Error saving lecture:', err);
      throw err;
    }
  }
}

module.exports = new LectureService();
