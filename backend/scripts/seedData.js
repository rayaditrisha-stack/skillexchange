import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import SwapSession from '../models/SwapSession.js';

dotenv.config();

const seedUsers = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@mit.edu',
    password: 'Password123!',
    campusName: 'MIT - Computer Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skillsOffered: [
      { skillName: 'React.js', level: 'Advanced', proofUrl: 'https://github.com/alexchen/react-microfrontends', verified: true },
      { skillName: 'Node.js & Express', level: 'Intermediate', proofUrl: 'https://github.com/alexchen/express-auth-template', verified: true }
    ],
    skillsNeeded: ['Machine Learning', 'Figma & UI/UX Design', 'Docker & Kubernetes'],
    escrowCredits: 4,
    reputationScore: 4.9,
    completedSwapsCount: 8
  },
  {
    name: 'Sophia Patel',
    email: 'sophia.p@stanford.edu',
    password: 'Password123!',
    campusName: 'Stanford AI Lab',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    skillsOffered: [
      { skillName: 'Machine Learning', level: 'Advanced', proofUrl: 'https://github.com/sophiap/pytorch-transformers', verified: true },
      { skillName: 'Python Data Science', level: 'Advanced', proofUrl: 'https://kaggle.com/sophiapatel', verified: true }
    ],
    skillsNeeded: ['Docker & Kubernetes', 'React.js', 'Solidity & Web3 Contracts'],
    escrowCredits: 3,
    reputationScore: 5.0,
    completedSwapsCount: 12
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.v@iit.ac.in',
    password: 'Password123!',
    campusName: 'IIT Bombay - DevOps Club',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skillsOffered: [
      { skillName: 'Docker & Kubernetes', level: 'Advanced', proofUrl: 'https://github.com/marcusv/k8s-campus-mesh', verified: true },
      { skillName: 'Golang Microservices', level: 'Intermediate', proofUrl: 'https://github.com/marcusv/go-grpc-demo', verified: true }
    ],
    skillsNeeded: ['React.js', 'Machine Learning', 'Figma & UI/UX Design'],
    escrowCredits: 5,
    reputationScore: 4.8,
    completedSwapsCount: 6
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@berkeley.edu',
    password: 'Password123!',
    campusName: 'UC Berkeley - Design Institute',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    skillsOffered: [
      { skillName: 'Figma & UI/UX Design', level: 'Advanced', proofUrl: 'https://figma.com/@elena_design', verified: true },
      { skillName: 'Tailwind CSS Design Systems', level: 'Advanced', proofUrl: 'https://dribbble.com/elena_r', verified: true }
    ],
    skillsNeeded: ['Node.js & Express', 'Python Data Science', 'Solidity & Web3 Contracts'],
    escrowCredits: 3,
    reputationScore: 4.9,
    completedSwapsCount: 10
  },
  {
    name: 'Liam O\'Connor',
    email: 'liam.oc@ox.ac.uk',
    password: 'Password123!',
    campusName: 'University of Oxford',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skillsOffered: [
      { skillName: 'Solidity & Web3 Contracts', level: 'Intermediate', proofUrl: 'https://etherscan.io/address/0x71C7656EC7ab88b098defB751B7401B5f6d8976F', verified: true },
      { skillName: 'TypeScript Engine', level: 'Advanced', proofUrl: 'https://github.com/liamoc/ts-compiler-tools', verified: true }
    ],
    skillsNeeded: ['Figma & UI/UX Design', 'React.js', 'Machine Learning'],
    escrowCredits: 3,
    reputationScore: 4.7,
    completedSwapsCount: 5
  }
];

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Purging existing users and sessions...');
    await User.deleteMany({});
    await SwapSession.deleteMany({});

    console.log('🌱 Seeding 5 diverse campus users...');
    const createdUsers = await User.create(seedUsers);
    console.log(`✅ Seeded ${createdUsers.length} users successfully!`);

    const alex = createdUsers.find(u => u.email === 'alex.chen@mit.edu');
    const sophia = createdUsers.find(u => u.email === 'sophia.p@stanford.edu');
    const marcus = createdUsers.find(u => u.email === 'marcus.v@iit.ac.in');
    const elena = createdUsers.find(u => u.email === 'elena.r@berkeley.edu');

    console.log('🤝 Creating initial demo swap sessions...');
    await SwapSession.create([
      {
        mentorId: alex._id,
        learnerId: sophia._id,
        skillName: 'React.js',
        sessionTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
        notes: 'Intro to React 19 concurrent features & server components',
        status: 'active',
        dualConfirmation: { mentorSigned: true, learnerSigned: false },
        creditsEscrowed: 1
      },
      {
        mentorId: sophia._id,
        learnerId: marcus._id,
        skillName: 'Machine Learning',
        sessionTime: new Date(Date.now() + 42 * 60 * 60 * 1000),
        notes: 'PyTorch Model Optimization & Fine-tuning',
        status: 'pending',
        dualConfirmation: { mentorSigned: false, learnerSigned: false },
        creditsEscrowed: 1
      },
      {
        mentorId: elena._id,
        learnerId: alex._id,
        skillName: 'Figma & UI/UX Design',
        sessionTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        notes: 'Design System & Component Tokens Workshop',
        status: 'completed',
        dualConfirmation: { mentorSigned: true, learnerSigned: true },
        creditsEscrowed: 1
      }
    ]);

    console.log('✨ Seed completed! All campus users & demo swap sessions created successfully.');
    return true;
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    return false;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => process.exit());
}
