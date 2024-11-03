const { Mentor, User, Team } = require('../models');

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMentor = async (req, res) => {
  try {
    const { userId, expertise, availability } = req.body;
    
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingMentor = await Mentor.findOne({ where: { userId } });
    if (existingMentor) {
      return res.status(400).json({ message: 'User is already a mentor' });
    }

    const mentor = await Mentor.create({
      userId,
      expertise,
      availability
    });

    res.status(201).json(mentor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.assignMentorToTeam = async (req, res) => {
  try {
    const { mentorId, teamId } = req.params;
    
    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await mentor.addTeam(team);
    res.json({ message: 'Mentor assigned to team successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMentorTeams = async (req, res) => {
  try {
    const mentor = await Mentor.findByPk(req.params.mentorId, {
      include: [{
        model: Team,
        through: { attributes: [] }
      }]
    });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor.Teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};