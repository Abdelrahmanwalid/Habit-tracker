const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  targetCount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: false // Not required to keep backward compatibility
  },
  tags: {
    type: [String], // Array of strings
    required: false // Not required to keep backward compatibility
  },
  logs: [
    {
      date: {
        type: Date,
        required: true
      },
      completedCount: {
        type: Number,
        required: true
      }
    }
  ],
  streak: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Habit', HabitSchema);