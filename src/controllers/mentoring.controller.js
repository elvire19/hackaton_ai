const { MentoringSession, Mentor, Team, User, Hackathon } = require('../models');
const { sendNotification } = require('../services/notification.service');

exports.getSessionsByHackathon = async (req, res) => {
  try {
    const sessions = await MentoringSession.findAll({
      where: { hackathonId: req.params.hackathonId },
      include: [
        { model: Mentor, include: [{ model: User }] },
        { model: Team }
      ]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { date } = req.query;

    // Get mentor's availability
    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Get mentor's booked sessions for the date
    const bookedSessions = await MentoringSession.findAll({
      where: {
        mentorId,
        startTime: {
          [Op.between]: [
            new Date(date).setHours(0, 0, 0),
            new Date(date).setHours(23, 59, 59)
          ]
        }
      }
    });

    // Get mentor's availability for the day
    const dayOfWeek = new Date(date).getDay();
    const availableSlots = mentor.availability[dayOfWeek] || [];

    // Filter out booked slots
    const availableTimeslots = availableSlots.filter(slot => {
      const slotStart = new Date(`${date}T${slot.start}`);
      return !bookedSessions.some(session => 
        new Date(session.startTime).getTime() === slotStart.getTime()
      );
    });

    res.json(availableTimeslots);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { mentorId, teamId, hackathonId, startTime } = req.body;
    const userId = req.user.id;

    // Verify user is part of the team
    const team = await Team.findByPk(teamId, {
      include: [{ model: User }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const isTeamMember = team.Users.some(user => user.id === userId);
    if (!isTeamMember) {
      return res.status(403).json({ message: 'You must be a team member to book a session' });
    }

    // Check if slot is available
    const slotStart = new Date(startTime);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hour sessions

    const existingSession = await MentoringSession.findOne({
      where: {
        mentorId,
        startTime: slotStart,
        status: 'scheduled'
      }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    // Create session
    const session = await MentoringSession.create({
      mentorId,
      teamId,
      hackathonId,
      startTime: slotStart,
      endTime: slotEnd,
      status: 'scheduled'
    });

    // Send notifications
    await sendNotification(session, 'session_scheduled');

    // Get session with related data
    const sessionWithDetails = await MentoringSession.findByPk(session.id, {
      include: [
        { model: Mentor, include: [{ model: User }] },
        { model: Team }
      ]
    });

    res.status(201).json(sessionWithDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { mentorId, teamId, hackathonId, startTime, endTime } = req.body;
    
    const session = await MentoringSession.create({
      mentorId,
      teamId,
      hackathonId,
      startTime,
      endTime,
      status: 'scheduled'
    });

    await sendNotification(session, 'session_scheduled');

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await MentoringSession.findByPk(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.update({ status });
    await sendNotification(session, `session_${status}`);

    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await MentoringSession.findByPk(sessionId, {
      include: [
        { model: Team, include: [{ model: User }] }
      ]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the team
    const isTeamMember = session.Team.Users.some(user => user.id === userId);
    if (!isTeamMember && req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'You do not have permission to cancel this session' });
    }

    // Check if session can be cancelled (not too close to start time)
    const now = new Date();
    const sessionStart = new Date(session.startTime);
    const hoursUntilSession = (sessionStart - now) / (1000 * 60 * 60);

    if (hoursUntilSession < 2 && req.user.role !== 'organizer') {
      return res.status(400).json({ message: 'Sessions cannot be cancelled less than 2 hours before start time' });
    }

    await session.update({ status: 'cancelled' });
    await sendNotification(session, 'session_cancelled');

    res.json({ message: 'Session cancelled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};