const { Team, User, Hackathon } = require('../models');
const { recommendTeams } = require('../services/ai.service');

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        { model: User },
        { model: Hackathon }
      ]
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { name, description, hackathonId, memberIds } = req.body;
    
    const team = await Team.create({
      name,
      description,
      hackathonId
    });

    if (memberIds && memberIds.length > 0) {
      await team.setUsers(memberIds);
    }

    const teamWithMembers = await Team.findByPk(team.id, {
      include: [{ model: User }]
    });

    res.status(201).json(teamWithMembers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Hackathon }
      ]
    });
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const team = await Team.findByPk(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await team.update({ name, description });

    if (memberIds) {
      await team.setUsers(memberIds);
    }

    const updatedTeam = await Team.findByPk(team.id, {
      include: [{ model: User }]
    });

    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addUserToTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    // Find team and user
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already in the team
    const existingMember = await team.hasUser(user);
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    // Get hackathon to check team size limit
    const hackathon = await Hackathon.findByPk(team.hackathonId);
    const currentTeamMembers = await team.countUsers();
    
    if (currentTeamMembers >= hackathon.maxTeamSize) {
      return res.status(400).json({ message: 'Team has reached maximum size limit' });
    }

    // Add user to team
    await team.addUser(user);

    // Get updated team with members
    const updatedTeam = await Team.findByPk(teamId, {
      include: [{ model: User }]
    });

    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeUserFromTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is in the team
    const isMember = await team.hasUser(user);
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }

    // Remove user from team
    await team.removeUser(user);

    // Get updated team with members
    const updatedTeam = await Team.findByPk(teamId, {
      include: [{ model: User }]
    });

    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.recommendTeams = async (req, res) => {
  try {
    const { hackathonId, teamSize } = req.params;
    const participants = await User.findAll({
      where: { role: 'participant' }
    });

    const recommendedTeams = await recommendTeams(participants, parseInt(teamSize));
    res.json(recommendedTeams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};