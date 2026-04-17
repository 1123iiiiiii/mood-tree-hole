const mongoose = require('mongoose');

const smallHappySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    enum: ['relax', 'exercise', 'create', 'social', 'grow', 'sense', 'organize', 'nature'],
    default: 'relax'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'once'],
    default: 'once'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  completions: [{
    completedAt: { type: Date, default: Date.now },
    moodBefore: String,
    moodAfter: String,
    intensityBefore: Number,
    intensityAfter: Number
  }],
  lastCompletedAt: {
    type: Date
  },
  streak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

smallHappySchema.index({ userId: 1, frequency: 1 });

module.exports = mongoose.model('SmallHappy', smallHappySchema);
