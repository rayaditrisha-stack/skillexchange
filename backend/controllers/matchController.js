import User from '../models/User.js';

// @desc    Get 1:1 Direct Bilateral Matches
// @route   GET /api/matches/direct
// @access  Private
export const getDirectMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const allPeers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    const myOffered = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const myNeeded = currentUser.skillsNeeded.map(s => s.toLowerCase());

    const directMatches = [];

    allPeers.forEach(peer => {
      const peerOffered = peer.skillsOffered.map(s => s.skillName.toLowerCase());
      const peerNeeded = peer.skillsNeeded.map(s => s.toLowerCase());

      const skillITeach = myOffered.find(s => peerNeeded.includes(s));
      const skillIWant = peerOffered.find(s => myNeeded.includes(s));

      if (skillITeach || skillIWant) {
        let matchScore = 50;
        if (skillITeach && skillIWant) matchScore = 100;
        else if (skillIWant) matchScore = 75;

        directMatches.push({
          peer,
          skillITeach: skillITeach ? currentUser.skillsOffered.find(s => s.skillName.toLowerCase() === skillITeach)?.skillName : null,
          skillIWant: skillIWant ? peer.skillsOffered.find(s => s.skillName.toLowerCase() === skillIWant)?.skillName : null,
          matchScore,
          isBilateral: !!(skillITeach && skillIWant)
        });
      }
    });

    directMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: directMatches.length,
      directMatches
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get 3-Way Triangular Circular Barter Cycles (Graph Cycle Discovery)
// @route   GET /api/matches/triangular
// @access  Private
export const getTriangularSwaps = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const allPeers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    const myOffered = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const myNeeded = currentUser.skillsNeeded.map(s => s.toLowerCase());

    const triangularSwaps = [];

    allPeers.forEach(userB => {
      const bOffered = userB.skillsOffered.map(s => s.skillName.toLowerCase());
      const bNeeded = userB.skillsNeeded.map(s => s.toLowerCase());

      // User A (Current) teaches User B
      const teachAtoB = myOffered.find(s => bNeeded.includes(s));
      if (!teachAtoB) return;

      allPeers.forEach(userC => {
        if (userC._id.toString() === userB._id.toString()) return;

        const cOffered = userC.skillsOffered.map(s => s.skillName.toLowerCase());
        const cNeeded = userC.skillsNeeded.map(s => s.toLowerCase());

        // User B teaches User C
        const teachBtoC = bOffered.find(s => cNeeded.includes(s));
        // User C teaches User A
        const teachCtoA = cOffered.find(s => myNeeded.includes(s));

        if (teachBtoC && teachCtoA) {
          triangularSwaps.push({
            userB: {
              _id: userB._id,
              name: userB.name,
              avatar: userB.avatar,
              campusName: userB.campusName
            },
            userC: {
              _id: userC._id,
              name: userC.name,
              avatar: userC.avatar,
              campusName: userC.campusName
            },
            step1: { from: 'You', to: userB.name, skill: currentUser.skillsOffered.find(s => s.skillName.toLowerCase() === teachAtoB)?.skillName },
            step2: { from: userB.name, to: userC.name, skill: userB.skillsOffered.find(s => s.skillName.toLowerCase() === teachBtoC)?.skillName },
            step3: { from: userC.name, to: 'You', skill: userC.skillsOffered.find(s => s.skillName.toLowerCase() === teachCtoA)?.skillName }
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      count: triangularSwaps.length,
      triangularSwaps
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get All Matches (Direct + Triangular)
// @route   GET /api/matches/all
// @access  Private
export const getAllMatches = async (req, res, next) => {
  try {
    const directRes = await new Promise((resolve, reject) => {
      getDirectMatches(req, {
        status: () => ({ json: resolve }),
      }, reject);
    });

    const triangularRes = await new Promise((resolve, reject) => {
      getTriangularSwaps(req, {
        status: () => ({ json: resolve }),
      }, reject);
    });

    res.status(200).json({
      success: true,
      directMatches: directRes.directMatches || [],
      triangularSwaps: triangularRes.triangularSwaps || []
    });
  } catch (err) {
    next(err);
  }
};
