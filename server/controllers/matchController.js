const User = require('../models/User');

// 1:1 Direct Matching
exports.getDirectMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const allUsers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    const myOfferedNames = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const myNeededNames = currentUser.skillsNeeded.map(s => s.toLowerCase());

    const directMatches = [];

    allUsers.forEach(peer => {
      const peerOfferedNames = peer.skillsOffered.map(s => s.skillName.toLowerCase());
      const peerNeededNames = peer.skillsNeeded.map(s => s.toLowerCase());

      const skillITeach = myOfferedNames.find(s => peerNeededNames.includes(s));
      const skillIWant = peerOfferedNames.find(s => myNeededNames.includes(s));

      if (skillITeach || skillIWant) {
        let score = 50;
        if (skillITeach && skillIWant) score = 100;
        else if (skillIWant) score = 75;

        directMatches.push({
          peer,
          skillITeach: skillITeach ? currentUser.skillsOffered.find(s => s.skillName.toLowerCase() === skillITeach)?.skillName : null,
          skillIWant: skillIWant ? peer.skillsOffered.find(s => s.skillName.toLowerCase() === skillIWant)?.skillName : null,
          matchScore: score,
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

// 3-Way Graph Cycle Barter Engine (DFS Depth = 3)
exports.getTriangularSwaps = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const allUsers = await User.find().select('-password');
    const userMap = new Map();
    allUsers.forEach(u => userMap.set(u._id.toString(), u));

    const adj = new Map();
    const edgeSkills = new Map();

    allUsers.forEach(u => adj.set(u._id.toString(), []));

    allUsers.forEach(userU => {
      const uId = userU._id.toString();
      const uOffered = userU.skillsOffered || [];

      allUsers.forEach(userV => {
        const vId = userV._id.toString();
        if (uId === vId) return;

        const vNeeded = (userV.skillsNeeded || []).map(s => s.toLowerCase());

        const matchingSkill = uOffered.find(s => vNeeded.includes(s.skillName.toLowerCase()));
        if (matchingSkill) {
          adj.get(uId).push(vId);
          edgeSkills.set(`${uId}->${vId}`, matchingSkill.skillName);
        }
      });
    });

    const startId = currentUser._id.toString();
    const cycles = [];
    const visitedInPath = new Set();

    const dfs = (currentId, path, depth) => {
      if (depth === 3) {
        const neighbors = adj.get(currentId) || [];
        if (neighbors.includes(startId)) {
          const userBId = path[1];
          const userCId = path[2];

          const userB = userMap.get(userBId);
          const userC = userMap.get(userCId);

          if (userB && userC) {
            cycles.push({
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
              step1: { from: 'You', to: userB.name, skill: edgeSkills.get(`${startId}->${userBId}`) },
              step2: { from: userB.name, to: userC.name, skill: edgeSkills.get(`${userBId}->${userCId}`) },
              step3: { from: userC.name, to: 'You', skill: edgeSkills.get(`${userCId}->${startId}`) }
            });
          }
        }
        return;
      }

      const neighbors = adj.get(currentId) || [];
      for (const neighborId of neighbors) {
        if (!visitedInPath.has(neighborId) && neighborId !== startId) {
          visitedInPath.add(neighborId);
          dfs(neighborId, [...path, neighborId], depth + 1);
          visitedInPath.delete(neighborId);
        }
      }
    };

    visitedInPath.add(startId);
    dfs(startId, [startId], 1);

    res.status(200).json({
      success: true,
      count: cycles.length,
      triangularSwaps: cycles,
      cycles
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllMatches = async (req, res, next) => {
  try {
    const directRes = await new Promise((resolve, reject) => {
      exports.getDirectMatches(req, { status: () => ({ json: resolve }) }, reject);
    });

    const cycleRes = await new Promise((resolve, reject) => {
      exports.getTriangularSwaps(req, { status: () => ({ json: resolve }) }, reject);
    });

    res.status(200).json({
      success: true,
      directMatches: directRes.directMatches || [],
      triangularSwaps: cycleRes.triangularSwaps || [],
      cycles: cycleRes.cycles || []
    });
  } catch (err) {
    next(err);
  }
};
