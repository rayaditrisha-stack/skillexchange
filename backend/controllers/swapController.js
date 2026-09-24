import SwapSession from '../models/SwapSession.js';
import User from '../models/User.js';

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

    const learner = await User.findById(learnerId);
    if (learner.escrowCredits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient escrow credits. Learner must have at least 1 credit available.'
      });
    }

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
      .populate('mentorId', 'name email avatar campusName reputationScore')
      .populate('learnerId', 'name email avatar campusName reputationScore');

    res.status(201).json({
      success: true,
      message: 'Swap session requested! 1 Escrow Credit held in protocol.',
      session: populated
    });
  } catch (err) {
    next(err);
  }
};

export const getMySwapSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const sessions = await SwapSession.find({
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
      return res.status(400).json({ success: false, message: 'Session has already been completed and escrow released.' });
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

      const learner = await User.findById(session.learnerId);
      const mentor = await User.findById(session.mentorId);

      if (learner && mentor) {
        if (learner.escrowCredits >= session.creditsEscrowed) {
          learner.escrowCredits -= session.creditsEscrowed;
        } else {
          learner.escrowCredits = 0;
        }
        mentor.escrowCredits += session.creditsEscrowed;

        learner.reputationScore = Math.min(5.0, Number((learner.reputationScore + 0.05).toFixed(1)));
        mentor.reputationScore = Math.min(5.0, Number((mentor.reputationScore + 0.1).toFixed(1)));

        learner.completedSwapsCount += 1;
        mentor.completedSwapsCount += 1;

        await learner.save();
        await mentor.save();
      }
    }

    await session.save();

    const updatedSession = await SwapSession.findById(sessionId)
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
