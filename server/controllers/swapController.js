const SkillSwapSession = require('../models/SkillSwapSession');
const User = require('../models/User');

// @desc    Initiate a new Skill Swap session
// @route   POST /api/swaps
// @access  Private
exports.createSwapSession = async (req, res, next) => {
  try {
    const { peerId, skillName, role, sessionTime, notes } = req.body;
    // role: 'learner' (requesting peer to teach me) or 'mentor' (offering to teach peer)

    if (!peerId || !skillName) {
      return res.status(400).json({
        success: false,
        message: 'Peer ID and skill name are required.'
      });
    }

    const peer = await User.findById(peerId);
    if (!peer) {
      return res.status(404).json({ success: false, message: 'Campus peer not found.' });
    }

    let mentorId, learnerId;
    if (role === 'mentor') {
      mentorId = req.user.id;
      learnerId = peerId;
    } else {
      mentorId = peerId;
      learnerId = req.user.id;
    }

    // Check learner escrow credits
    const learner = await User.findById(learnerId);
    if (learner.escrowCredits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Learner has insufficient escrow credits (minimum 1 credit required).'
      });
    }

    const session = await SkillSwapSession.create({
      mentorId,
      learnerId,
      skillName,
      sessionTime: sessionTime ? new Date(sessionTime) : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default tomorrow
      notes: notes || `Campus exchange session for ${skillName}`,
      status: 'pending',
      creditsEscrowed: 1,
      dualConfirmation: { mentorSigned: false, learnerSigned: false }
    });

    // Populate user info for response
    const populated = await SkillSwapSession.findById(session._id)
      .populate('mentorId', 'name email avatar campusName reputationScore')
      .populate('learnerId', 'name email avatar campusName reputationScore');

    res.status(201).json({
      success: true,
      message: 'Skill swap session requested! 1 Escrow Credit held in escrow.',
      session: populated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's swap sessions (as mentor or learner)
// @route   GET /api/swaps
// @access  Private
exports.getMySwaps = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sessions = await SkillSwapSession.find({
      $or: [{ mentorId: userId }, { learnerId: userId }]
    })
      .populate('mentorId', 'name email avatar campusName reputationScore')
      .populate('learnerId', 'name email avatar campusName reputationScore')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Dual Confirmation Signature & Escrow Release
// @route   PUT /api/swaps/:id/confirm
// @access  Private
exports.signSwapConfirmation = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id.toString();

    const session = await SkillSwapSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isMentor = session.mentorId.toString() === userId;
    const isLearner = session.learnerId.toString() === userId;

    if (!isMentor && !isLearner) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this session.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Session is already completed and credits released!' });
    }

    // Update signature
    if (isMentor) {
      session.dualConfirmation.mentorSigned = true;
    }
    if (isLearner) {
      session.dualConfirmation.learnerSigned = true;
    }

    // Set to active if at least one signed
    if (session.status === 'pending') {
      session.status = 'active';
    }

    let escrowReleased = false;

    // DUAL SIGNATURE CHECK: If BOTH mentor & learner signed, complete session and transfer credits!
    if (session.dualConfirmation.mentorSigned && session.dualConfirmation.learnerSigned) {
      session.status = 'completed';
      escrowReleased = true;

      // Credit Transfer from Learner to Mentor
      const learner = await User.findById(session.learnerId);
      const mentor = await User.findById(session.mentorId);

      if (learner && mentor) {
        if (learner.escrowCredits >= session.creditsEscrowed) {
          learner.escrowCredits -= session.creditsEscrowed;
        } else {
          learner.escrowCredits = 0;
        }
        mentor.escrowCredits += session.creditsEscrowed;

        // Reputation score boost
        learner.reputationScore = Math.min(5.0, Number((learner.reputationScore + 0.05).toFixed(1)));
        mentor.reputationScore = Math.min(5.0, Number((mentor.reputationScore + 0.1).toFixed(1)));

        learner.completedSwapsCount += 1;
        mentor.completedSwapsCount += 1;

        await learner.save();
        await mentor.save();
      }
    }

    await session.save();

    const updatedSession = await SkillSwapSession.findById(sessionId)
      .populate('mentorId', 'name email avatar campusName reputationScore escrowCredits')
      .populate('learnerId', 'name email avatar campusName reputationScore escrowCredits');

    res.status(200).json({
      success: true,
      message: escrowReleased
        ? '🎉 Dual signatures verified! Escrow credit released to mentor and reputation scores updated.'
        : 'Signature recorded. Awaiting peer confirmation to release escrow.',
      session: updatedSession,
      escrowReleased
    });
  } catch (err) {
    next(err);
  }
};
