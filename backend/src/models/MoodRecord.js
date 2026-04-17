const mongoose = require('mongoose');

const moodRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mode: {
    type: String,
    enum: ['select', 'essay'],
    required: true
  },
  mood: {
    type: String,
    enum: ['happy', 'calm', 'anxious', 'sad', 'angry', 'fearful', 'surprised'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  event: {
    type: String,
    default: ''
  },
  mixedMoods: [{
    mood: String,
    percentage: Number
  }],
  tags: [{
    type: String,
    enum: ['work', 'family', 'health', 'relationship', 'finance', 'study', 'other']
  }],
  analysis: {
    psychologyInsight: String,
    suggestion: String,
    needLevel: String
  },
  timeSlot: {
    type: String,
    enum: ['dawn', 'morning', 'noon', 'afternoon', 'evening', 'night'],
    default: function() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 9) return 'dawn';
      if (hour >= 9 && hour < 12) return 'morning';
      if (hour >= 12 && hour < 14) return 'noon';
      if (hour >= 14 && hour < 18) return 'afternoon';
      if (hour >= 18 && hour < 22) return 'evening';
      return 'night';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

moodRecordSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MoodRecord', moodRecordSchema);
