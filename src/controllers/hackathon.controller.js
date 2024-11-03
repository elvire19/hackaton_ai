const { Hackathon, Team, Project, User, MentoringSession } = require('../models');
const { Parser } = require('json2csv');

exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll();
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByPk(req.params.id, {
      include: [
        { model: Team },
        { model: Project }
      ]
    });
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHackathonStatistics = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByPk(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Get teams and their members
    const teams = await Team.findAll({
      where: { hackathonId: req.params.id },
      include: [{ model: User }]
    });

    // Get projects
    const projects = await Project.findAll({
      where: { hackathonId: req.params.id }
    });

    // Get mentoring sessions
    const mentoringSessions = await MentoringSession.findAll({
      where: { hackathonId: req.params.id }
    });

    // Calculate statistics
    const statistics = {
      participantCount: teams.reduce((acc, team) => acc + team.Users.length, 0),
      teamCount: teams.length,
      projectCount: projects.length,
      submittedProjectCount: projects.filter(p => p.status === 'submitted').length,
      evaluatedProjectCount: projects.filter(p => p.status === 'evaluated').length,
      mentoringSessions: {
        total: mentoringSessions.length,
        scheduled: mentoringSessions.filter(s => s.status === 'scheduled').length,
        completed: mentoringSessions.filter(s => s.status === 'completed').length,
        cancelled: mentoringSessions.filter(s => s.status === 'cancelled').length
      },
      averageTeamSize: teams.length ? 
        (teams.reduce((acc, team) => acc + team.Users.length, 0) / teams.length).toFixed(1) : 0,
      projectStatuses: {
        in_progress: projects.filter(p => p.status === 'in_progress').length,
        submitted: projects.filter(p => p.status === 'submitted').length,
        evaluated: projects.filter(p => p.status === 'evaluated').length
      }
    };

    // Update hackathon statistics
    await hackathon.update({ statistics });

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportHackathonData = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByPk(req.params.id, {
      include: [
        { 
          model: Team,
          include: [
            { model: User },
            { model: Project }
          ]
        },
        { model: Project }
      ]
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Prepare data for CSV
    const exportData = {
      hackathonInfo: {
        name: hackathon.name,
        description: hackathon.description,
        startDate: hackathon.startDate,
        endDate: hackathon.endDate,
        status: hackathon.status
      },
      teams: hackathon.Teams.map(team => ({
        teamName: team.name,
        memberCount: team.Users.length,
        members: team.Users.map(u => u.name).join(', '),
        projectName: team.Project ? team.Project.name : 'No project',
        projectStatus: team.Project ? team.Project.status : 'N/A',
        projectScore: team.Project ? team.Project.finalScore : 'N/A'
      })),
      projects: hackathon.Projects.map(project => ({
        name: project.name,
        status: project.status,
        technologies: project.technologies.join(', '),
        aiScore: project.aiScore,
        finalScore: project.finalScore
      }))
    };

    // Convert to CSV
    const fields = {
      hackathonInfo: ['name', 'description', 'startDate', 'endDate', 'status'],
      teams: ['teamName', 'memberCount', 'members', 'projectName', 'projectStatus', 'projectScore'],
      projects: ['name', 'status', 'technologies', 'aiScore', 'finalScore']
    };

    const parser = new Parser({ fields: fields.hackathonInfo });
    const hackathonCsv = parser.parse([exportData.hackathonInfo]);
    
    const teamsParser = new Parser({ fields: fields.teams });
    const teamsCsv = teamsParser.parse(exportData.teams);
    
    const projectsParser = new Parser({ fields: fields.projects });
    const projectsCsv = projectsParser.parse(exportData.projects);

    const fullCsv = `Hackathon Information\n${hackathonCsv}\n\nTeams\n${teamsCsv}\n\nProjects\n${projectsCsv}`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=hackathon-${hackathon.id}-export.csv`);
    res.send(fullCsv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByPk(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    await hackathon.update(req.body);
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findByPk(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    await hackathon.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};