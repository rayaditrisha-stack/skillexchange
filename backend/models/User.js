import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillOfferedSchema = new mongoose.Schema({
  skillName: { type: String, required: true, trim: true },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  proofUrl: { type: String, default: '' },
  verified: { type: Boolean, default: true }
}, { _id: true });

const campusEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in|edu\.[a-z]{2}|ac\.[a-z]{2}|org)$/i;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide campus email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return campusEmailRegex.test(v);
      },
      message: props => `${props.value} is not a valid campus email! Email must end with a recognized campus domain (e.g. .edu, .ac.in).`
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(this.name || 'Student')}`;
    }
  },
  campusName: {
    type: String,
    default: 'MIT Campus'
  },
  skillsOffered: [skillOfferedSchema],
  skillsNeeded: [{ type: String, trim: true }],
  escrowCredits: {
    type: Number,
    default: 3, // 3 free credits upon signup
    min: 0
  },
  reputationScore: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  completedSwapsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
