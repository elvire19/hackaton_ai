const { Team, User, Project, MentoringSession, Mentor, Hackathon } = require('../models');

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: User,
          through: 'TeamMembers',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Project,
          attributes: ['id', 'name', 'description', 'githubUrl', 'demoUrl', 'technologies', 'status']
        },
        {
          model: Mentor,
          through: 'MentorAssignments',
          attributes: ['id', 'expertise']
        },
        {
          model: MentoringSession,
          include: [{
            model: Mentor,
            attributes: ['id', 'expertise']
          }]
        },
        {
          model: Hackathon,
          attributes: ['id', 'name', 'startDate', 'endDate', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      message: 'Failed to fetch teams',
      error: error.message 
    });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      include: [
        {
          model: User,
          through: 'TeamMembers',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Project,
          attributes: ['id', 'name', 'description', 'githubUrl', 'demoUrl', 'technologies', 'status']
        },
        {
          model: Mentor,
          through: 'MentorAssignments',
          attributes: ['id', 'expertise']
        },
        {
          model: MentoringSession,
          include: [{
            model: Mentor,
            attributes: ['id','expertise']
          }],
          order: [['scheduledAt', 'DESC']]
        },
        {
          model: Hackathon,
          attributes: ['id', 'name', 'startDate', 'endDate', 'status', 'maxTeamSize']
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ 
      message: 'Failed to fetch team',
      error: error.message 
    });
  }
};


exports.getMembersByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findByPk(teamId, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email', 'role'],
        through: { attributes: ['joinedAt', 'role'] }
      }]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team.users);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ 
      message: 'Failed to fetch team members',
      error: error.message 
    });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, description, hackathonId, memberIds, mentorIds } = req.body;
    
    const team = await Team.create({
      name,
      description,
      hackathonId
    });

    // Add members if provided
    if (memberIds && memberIds.length > 0) {
      await team.addUser(memberIds);
    }

    // Add mentors if provided
    if (mentorIds && mentorIds.length > 0) {
      await team.addMentor(mentorIds);
    }

    // Fetch the created team with all associations
    const teamWithAssociations = await Team.findByPk(team.id, {
      include: [
        {
          model: User,
          through: 'TeamMembers',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Mentor,
          through: 'MentorAssignments',
          attributes: ['id', 'expertise']
        }
      ]
    });

    res.status(201).json(teamWithAssociations);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ 
      message: 'Failed to create team',
      error: error.message 
    });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, memberIds, mentorIds } = req.body;

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update basic team info
    await team.update({ name, description });

    // Update members if provided
    if (memberIds) {
      await team.setUsers(memberIds);
    }

    // Update mentors if provided
    if (mentorIds) {
      await team.setMentors(mentorIds);
    }

    // Fetch updated team with all associations
    const updatedTeam = await Team.findByPk(id, {
      include: [
        {
          model: User,
          through: 'TeamMembers',
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Mentor,
          through: 'MentorAssignments',
          attributes: ['id', 'expertise']
        }
      ]
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(400).json({ 
      message: 'Failed to update team',
      error: error.message 
    });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ 
      message: 'Failed to delete team',
      error: error.message 
    });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, role = 'member' } = req.body;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await team.addUser(userId, {
      through: { role, joinedAt: new Date() }
    });

    const updatedTeam = await Team.findByPk(teamId, {
      include: [{
        model: User,
        through: 'TeamMembers',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(400).json({ 
      message: 'Failed to add team member',
      error: error.message 
    });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.removeUser(userId);

    const updatedTeam = await Team.findByPk(teamId, {
      include: [{
        model: User,
        through: 'TeamMembers',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(400).json({ 
      message: 'Failed to remove team member',
      error: error.message 
    });
  }
};

exports.assignMentor = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { mentorId } = req.body;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    await team.addMentor(mentorId, {
      through: { assignedAt: new Date() }
    });

    const updatedTeam = await Team.findByPk(teamId, {
      include: [{
        model: Mentor,
        through: 'MentorAssignments',
        attributes: ['id', 'name', 'expertise']
      }]
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error assigning mentor:', error);
    res.status(400).json({ 
      message: 'Failed to assign mentor',
      error: error.message 
    });
  }
};

exports.removeMentor = async (req, res) => {
  try {
    const { teamId, mentorId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.removeMentor(mentorId);

    const updatedTeam = await Team.findByPk(teamId, {
      include: [{
        model: Mentor,
        through: 'MentorAssignments',
        attributes: ['id', 'name', 'expertise']
      }]
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Error removing mentor:', error);
    res.status(400).json({ 
      message: 'Failed to remove mentor',
      error: error.message 
    });
  }
};

exports.scheduleMentoringSession = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { mentorId, scheduledAt, duration, description } = req.body;

    const session = await MentoringSession.create({
      teamId,
      mentorId,
      scheduledAt,
      duration,
      description,
      status: 'scheduled'
    });

    const sessionWithDetails = await MentoringSession.findByPk(session.id, {
      include: [{
        model: Mentor,
        attributes: ['id', 'name', 'expertise']
      }]
    });

    res.status(201).json(sessionWithDetails);
  } catch (error) {
    console.error('Error scheduling mentoring session:', error);
    res.status(400).json({ 
      message: 'Failed to schedule mentoring session',
      error: error.message 
    });
  }
};

exports.getMentoringSessions = async (req, res) => {
  try {
    const { teamId } = req.params;

    const sessions = await MentoringSession.findAll({
      where: { teamId },
      include: [{
        model: Mentor,
        attributes: ['id', 'name', 'expertise']
      }],
      order: [['scheduledAt', 'DESC']]
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching mentoring sessions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch mentoring sessions',
      error: error.message 
    });
  }
};

exports.updateMentoringSession = async (req, res) => {
  try {
    const { teamId, sessionId } = req.params;
    const updates = req.body;

    const session = await MentoringSession.findOne({
      where: { id: sessionId, teamId }
    });

    if (!session) {
      return res.status(404).json({ message: 'Mentoring session not found' });
    }

    await session.update(updates);

    const updatedSession = await MentoringSession.findByPk(session.id, {
      include: [{
        model: Mentor,
        attributes: ['id', 'name', 'expertise']
      }]
    });

    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating mentoring session:', error);
    res.status(400).json({ 
      message: 'Failed to update mentoring session',
      error: error.message 
    });
  }
};

exports.getTeamAnalytics = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          through: 'TeamMembers'
        },
        {
          model: MentoringSession,
          include: [{
            model: Mentor
          }]
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const completedSessions = team.MentoringSessions.filter(
      session => session.status === 'completed'
    ).length;

    const analytics = {
      memberContributions: team.Users.map(member => ({
        userId: member.id,
        contributions: Math.floor(Math.random() * 100) // Replace with actual contribution calculation
      })),
      mentoringMetrics: {
        totalSessions: team.MentoringSessions.length,
        completedSessions,
        completionRate: team.MentoringSessions.length > 0 
          ? (completedSessions / team.MentoringSessions.length) * 100 
          : 0
      },
      projectProgress: Math.floor(Math.random() * 100) // Replace with actual progress calculation
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch team analytics',
      error: error.message 
    });
  }
};