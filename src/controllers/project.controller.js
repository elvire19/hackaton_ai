const { Project, Team, User, Evaluation } = require('../models');
const { analyzeProject, calculateFinalScore } = require('../services/ai.service');

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