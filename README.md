# SkillMesh: Decentralized Campus Skill Exchange ⚡

[![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express.js-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)

**SkillMesh** is a production-grade, secure, modern MERN-stack web application designed for zero-cash bilateral and triangular peer-to-peer campus skill exchanges.

---

## 🔥 Key Features

- **Linear / Vercel Aesthetic UI**: Deep slate neutral palette (`slate-950`), clean glassmorphism card surfaces, and high-contrast Emerald & Violet gradients.
- **Bilateral & Triangular Match Engine**: Automated matching algorithms calculating direct 1:1 bilateral skill swaps as well as 3-party triangular loop exchanges (*You teach X to Peer B ➔ Peer B teaches Y to Peer C ➔ Peer C teaches Z to You*).
- **Dual Confirmation Escrow Engine**: 1 credit held in smart protocol lock upon session request; credits and reputation points released only when both mentor and learner sign session completion.
- **Multi-Step Campus Onboarding**: Strict campus domain regex validation (`.edu`, `.ac.in`), password strength entropy meter, teachable skill listing, and wishlist manager.
- **Secure Authentication**: Password hashing via `bcryptjs`, JWT stored in `httpOnly` cookies, sanitized queries, and strict CORS configuration.
- **Automatic Seed & Fallback DB**: Integrated `mongodb-memory-server` fallback if local MongoDB is offline, auto-populating 5 diverse campus mentors on startup.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React Icons, React Router DOM v7.
- **Backend**: Node.js, Express.js (Modular MVC: Controllers, Routes, Models, Middleware).
- **Database**: MongoDB Atlas / Mongoose ODM (with MongoMemoryServer auto-fallback).
- **Authentication**: JWT, `bcryptjs`, `cookie-parser`.

---

## 📦 Installation & Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/rayaditrisha-stack/skillexchange.git
   cd skillexchange
   ```

2. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Environment Configuration**:
   Create `server/.env` with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/skillmesh
   JWT_SECRET=skillmesh_decentralized_campus_secret_key_2026_998877
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

4. **Run Development Mode**:
   ```bash
   # Runs Express server (port 5000) & Vite React client (port 5173) concurrently
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm --prefix client run build
   ```

---

## ⚡ Seed Accounts for Instant Demo

Log in with any of these pre-configured campus accounts or use the **Instant 1-Click Demo Buttons** on the Login page (`http://localhost:5173/login`):

| Student | Campus Email | Campus Node | Offered Skills |
| :--- | :--- | :--- | :--- |
| **Alex Chen** | `alex.chen@mit.edu` | MIT | React.js (Advanced), Node.js |
| **Sophia Patel** | `sophia.p@stanford.edu` | Stanford | Machine Learning (Advanced), PyTorch |
| **Marcus Vance** | `marcus.v@iit.ac.in` | IIT Bombay | Docker & Kubernetes (Advanced), Golang |
| **Elena Rostova** | `elena.r@berkeley.edu` | UC Berkeley | Figma & UI/UX Design (Advanced), Tailwind |
| **Liam O'Connor** | `liam.oc@ox.ac.uk` | Oxford | Solidity & Web3 Contracts, TypeScript |

*(Password for all demo accounts: `Password123!`)*

---

## 📄 License

MIT © 2026 SkillMesh Protocol
