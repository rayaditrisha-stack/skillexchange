import SwapSession from '../models/SwapSession.js';
import User from '../models/User.js';

// @desc    Initiate a new Swap Session & lock 1 credit in escrow ($inc: { escrowCredits: -1 })
// @route   POST /api/swaps
// @access  Private
export const createSwapSession = async (req, res, next) => {
  try {
    const { peerId, skillName, role, sessionTime, notes } = req.body;

    if (!peerId || !skillName) {
      return res.status(400).json({
        success: false,
        message: 'Peer ID and target skill name are required.'
      });
    }

    const peer = await User.findById(peerId);
    if (!peer) {
      return res.status(404).json({ success: false, message: 'Campus peer not found.' });
    }

    let mentorId, learnerId;
    if (role === 'mentor') {
      mentorId = req.user._id;
      learnerId = peerId;
    } else {
      mentorId = peerId;
      learnerId = req.user._id;
    }

    // Verify learner has at least 1 credit available
    const learner = await User.findById(learnerId);
    if (learner.escrowCredits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Learner has insufficient escrow credits (minimum 1 credit required).'
      });
    }

    // Atomic Escrow Lock: deduct 1 credit from learner
    await User.findByIdAndUpdate(learnerId, {
      $inc: { escrowCredits: -1 }
    });

    const session = await SwapSession.create({
      mentorId,
      learnerId,
      skillName,
      sessionTime: sessionTime ? new Date(sessionTime) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      notes: notes || `Campus skill exchange session for ${skillName}`,
      status: 'pending',
      creditsEscrowed: 1,
      dualConfirmation: { mentorSigned: false, learnerSigned: false }
    });

    const populated = await SwapSession.findById(session._id)
      .populate('mentorId', 'name email avatar campusName reputationScore escrowCredits')
      .populate('learnerId', 'name email avatar campusName reputationScore escrowCredits');

    res.status(201).json({
      success: true,
      message: 'Swap session requested! 1 Escrow Credit locked into protocol hold.',
      session: populated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's swap sessions
// @route   GET /api/swaps
// @access  Private
export const getMySwapSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const sessions = await SwapSession.find({
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

// @desc    Dual-Signature Confirmation & Atomic Escrow Release ($inc: { escrowCredits: 1 })
// @route   PATCH /api/swaps/:id/sign  or  PUT /api/swaps/:id/confirm
// @access  Private
export const signSwapConfirmation = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id.toString();

    const session = await SwapSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const isMentor = session.mentorId.toString() === userId;
    const isLearner = session.learnerId.toString() === userId;

    if (!isMentor && !isLearner) {
      return res.status(403).json({ success: false, message: 'Not authorized for this session.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Session is already completed and credits released.' });
    }

    // Apply signature
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

    // DUAL SIGNATURE CHECK: When both mentorSigned AND learnerSigned are true, release credit to mentor!
    if (session.dualConfirmation.mentorSigned && session.dualConfirmation.learnerSigned) {
      session.status = 'completed';
      escrowReleased = true;

      // Atomic release: add 1 credit to mentor ($inc: { escrowCredits: 1 })
      await User.findByIdAndUpdate(session.mentorId, {
        $inc: { escrowCredits: 1, completedSwapsCount: 1 }
      });

      // Increment learner completed count
      await User.findByIdAndUpdate(session.learnerId, {
        $inc: { completedSwapsCount: 1 }
      });

      // Update reputation scores
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

    const updatedSession = await SwapSession.findById(sessionId)
      .populate('mentorId', 'name email avatar campusName reputationScore escrowCredits')
      .populate('learnerId', 'name email avatar campusName reputationScore escrowCredits');

    res.status(200).json({
      success: true,
      message: escrowReleased
        ? '🎉 Dual signatures verified! 1 Escrow Credit released to mentor and reputation scores updated.'
        : 'Signature recorded. Awaiting peer signature to release escrow credit.',
      session: updatedSession,
      escrowReleased
    });
  } catch (err) {
    next(err);
  }
};
