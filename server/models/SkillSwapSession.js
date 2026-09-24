const mongoose = require('mongoose');

const skillSwapSessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required for session'],
    trim: true
  },
  sessionTime: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: 'Campus peer exchange session'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  dualConfirmation: {
    mentorSigned: { type: Boolean, default: false },
    learnerSigned: { type: Boolean, default: false }
  },
  creditsEscrowed: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillSwapSession', skillSwapSessionSchema);
