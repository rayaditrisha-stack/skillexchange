const SkillSwapSession = require('../models/SkillSwapSession');
const User = require('../models/User');

// Initiate swap session & lock 1 credit in escrow ($inc: { escrowCredits: -1 })
exports.createSwapSession = async (req, res, next) => {
  try {
    const { peerId, skillName, role, sessionTime, notes } = req.body;

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

    const learner = await User.findById(learnerId);
    if (learner.escrowCredits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Learner has insufficient escrow credits (minimum 1 credit required).'
      });
    }

    // Atomic Escrow Lock
    await User.findByIdAndUpdate(learnerId, {
      $inc: { escrowCredits: -1 }
    });

    const session = await SkillSwapSession.create({
      mentorId,
      learnerId,
      skillName,
      sessionTime: sessionTime ? new Date(sessionTime) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      notes: notes || `Campus exchange session for ${skillName}`,
      status: 'pending',
      creditsEscrowed: 1,
      dualConfirmation: { mentorSigned: false, learnerSigned: false }
    });

    const populated = await SkillSwapSession.findById(session._id)
      .populate('mentorId', 'name email avatar campusName reputationScore escrowCredits')
      .populate('learnerId', 'name email avatar campusName reputationScore escrowCredits');

    res.status(201).json({
      success: true,
      message: 'Skill swap session requested! 1 Escrow Credit locked in protocol hold.',
      session: populated
    });
  } catch (err) {
    next(err);
  }
};

exports.getMySwaps = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sessions = await SkillSwapSession.find({
      $or: [{ mentorId: userId }, { learnerId: userId }]
    })
      .populate('mentorId', 'name email avatar campusName reputationScore escrowCredits')
      .populate('learnerId', 'name email avatar campusName reputationScore escrowCredits')
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

// Dual Confirmation Signature & Escrow Release ($inc: { escrowCredits: 1 })
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

    if (isMentor) {
      session.dualConfirmation.mentorSigned = true;
    }
    if (isLearner) {
      session.dualConfirmation.learnerSigned = true;
    }

    if (session.status === 'pending') {
      session.status = 'active';
    }

    let escrowReleased = false;

    if (session.dualConfirmation.mentorSigned && session.dualConfirmation.learnerSigned) {
      session.status = 'completed';
      escrowReleased = true;

      // Atomic Credit Release to Mentor
      await User.findByIdAndUpdate(session.mentorId, {
        $inc: { escrowCredits: 1, completedSwapsCount: 1 }
      });

      await User.findByIdAndUpdate(session.learnerId, {
        $inc: { completedSwapsCount: 1 }
      });

      const mentor = await User.findById(session.mentorId);
      const learner = await User.findById(session.learnerId);

      if (mentor) {
        mentor.reputationScore = Math.min(5.0, Number((mentor.reputationScore + 0.1).toFixed(1)));
        await mentor.save();
      }
      if (learner) {
        learner.reputationScore = Math.min(5.0, Number((learner.reputationScore + 0.05).toFixed(1)));
        await learner.save();
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
