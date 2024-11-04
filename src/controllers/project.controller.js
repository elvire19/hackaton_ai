const { Project, Team, User, Evaluation } = require('../models');
const { analyzeProject, calculateFinalScore } = require('../services/ai.service');


exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: Team,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      message: 'Failed to fetch projects',
      error: error.message 
    });
  }
};

exports.getProjectsByHackathon = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { hackathonId: req.params.hackathonId },
      include: [{ 
        model: Team,
        include: [{ model: User }]
      }]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitProject = async (req, res) => {
  try {
    const { name, description, githubUrl, demoUrl, technologies, hackathonId, teamId } = req.body;
    
    const project = await Project.create({
      name,
      description,
      githubUrl,
      demoUrl,
      technologies,
      hackathonId,
      teamId,
      status: 'submitted'
    });

    const aiScore = await analyzeProject(project);
    await project.update({ aiScore });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjectEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      where: { projectId: req.params.projectId },
      include: [{ model: User, as: 'Jury' }]
    });
    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculateProjectScore = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId, {
      include: [{ model: Evaluation }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const finalScore = await calculateFinalScore(project);
    await project.update({ 
      finalScore,
      status: 'evaluated'
    });

    res.json({ finalScore });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, fetch the project with team and user information
    const project = await Project.findByPk(id, {
      include: [{
        model: Team,
        include: [{
          model: User,
          as: 'Users', // Make sure this matches your model association alias
          attributes: ['id', 'name', 'email', 'role']
        }]
      }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Then, fetch evaluations separately with jury information
    const evaluations = await Evaluation.findAll({
      where: { projectId: id },
      include: [{
        model: User,
        as: 'Jury', // Make sure this matches your model association alias
        attributes: ['id', 'name', 'role']
      }]
    });

    // Combine project data with evaluations
    const projectData = project.toJSON();
    projectData.evaluations = evaluations;

    res.json(projectData);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      message: 'Failed to fetch project details',
      error: error.message 
    });
  }
};

