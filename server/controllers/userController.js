const User = require('../models/User');

// @desc    Get all public campus users with optional search/filter
// @route   GET /api/users
// @access  Public
exports.getPublicUsers = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;
    let query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { campusName: regex },
        { 'skillsOffered.skillName': regex },
        { skillsNeeded: regex }
      ];
    }

    let users = await User.find(query).select('-password');

    if (level && level !== 'All') {
      users = users.filter(u => 
        u.skillsOffered.some(s => s.level.toLowerCase() === level.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new offered skill for current user
// @route   POST /api/users/skills-offered
// @access  Private
exports.addOfferedSkill = async (req, res, next) => {
  try {
    const { skillName, level, proofUrl } = req.body;

    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if skill already exists
    const exists = user.skillsOffered.some(
      s => s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: `You are already offering ${skillName}.`
      });
    }

    user.skillsOffered.push({
      skillName,
      level: level || 'Intermediate',
      proofUrl: proofUrl || '',
      verified: true
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully added ${skillName} to your offered skills!`,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update needed skills / wishlist
// @route   PUT /api/users/skills-needed
// @access  Private
exports.updateNeededSkills = async (req, res, next) => {
  try {
    const { skillsNeeded } = req.body;
    if (!Array.isArray(skillsNeeded)) {
      return res.status(400).json({ success: false, message: 'skillsNeeded must be an array of strings.' });
    }

    const user = await User.findById(req.user.id);
    user.skillsNeeded = skillsNeeded;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist updated successfully.',
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Calculate 1:1 Direct Matches and Triangular (3-Way) Swap Opportunities
// @route   GET /api/users/matches
// @access  Private
exports.getMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const allUsers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    const myOfferedNames = currentUser.skillsOffered.map(s => s.skillName.toLowerCase());
    const myNeededNames = currentUser.skillsNeeded.map(s => s.toLowerCase());

    // 1. Direct 1:1 Matches
    // Peer offers a skill I need AND peer needs a skill I offer
    const directMatches = [];

    allUsers.forEach(peer => {
      const peerOfferedNames = peer.skillsOffered.map(s => s.skillName.toLowerCase());
      const peerNeededNames = peer.skillsNeeded.map(s => s.toLowerCase());

      const skillITeach = myOfferedNames.find(s => peerNeededNames.includes(s));
      const skillIWant = peerOfferedNames.find(s => myNeededNames.includes(s));

      if (skillITeach || skillIWant) {
        // Match score calculation
        let score = 0;
        if (skillITeach && skillIWant) score = 100; // Perfect bilateral exchange!
        else if (skillIWant) score = 75;
        else score = 50;

        directMatches.push({
          peer,
          skillITeach: skillITeach ? currentUser.skillsOffered.find(s => s.skillName.toLowerCase() === skillITeach)?.skillName : null,
          skillIWant: skillIWant ? peer.skillsOffered.find(s => s.skillName.toLowerCase() === skillIWant)?.skillName : null,
          matchScore: score,
          isBilateral: !!(skillITeach && skillIWant)
        });
      }
    });

    // Sort by match score
    directMatches.sort((a, b) => b.matchScore - a.matchScore);

    // 2. Triangular Swap Opportunities (3-party cycle)
    // Loop: User A (Current) -> User B -> User C -> User A
    const triangularSwaps = [];

    allUsers.forEach(userB => {
      const bOfferedNames = userB.skillsOffered.map(s => s.skillName.toLowerCase());
      const bNeededNames = userB.skillsNeeded.map(s => s.toLowerCase());

      // Does User A teach a skill that User B needs?
      const teachAtoB = myOfferedNames.find(s => bNeededNames.includes(s));
      if (!teachAtoB) return;

      allUsers.forEach(userC => {
        if (userC._id.toString() === userB._id.toString()) return;

        const cOfferedNames = userC.skillsOffered.map(s => s.skillName.toLowerCase());
        const cNeededNames = userC.skillsNeeded.map(s => s.toLowerCase());

        // Does User B teach a skill that User C needs?
        const teachBtoC = bOfferedNames.find(s => cNeededNames.includes(s));
        // Does User C teach a skill that User A needs?
        const teachCtoA = cOfferedNames.find(s => myNeededNames.includes(s));

        if (teachBtoC && teachCtoA) {
          // Found a 3-way cycle!
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
      directMatches,
      triangularSwaps
    });
  } catch (err) {
    next(err);
  }
};
