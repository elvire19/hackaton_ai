const { Jury, Project, User } = require('../models');

exports.getAllJuries = async (req, res) => {
  try {
    const juries = await Jury.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(juries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJury = async (req, res) => {
  try {
    const { userId, specialization, evaluationCriteria } = req.body;
    
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingJury = await Jury.findOne({ where: { juryUserId: userId } });
    if (existingJury) {
      return res.status(400).json({ message: 'User is already a jury member' });
    }

    const jury = await Jury.create({
      juryUserId: userId,
      specialization,
      evaluationCriteria
    });

    await existingUser.update({ role: 'jury' });

    res.status(201).json(jury);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.submitEvaluation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { score, feedback } = req.body;
    const juryId = req.user.Jury.id;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.addJury(juryId, {
      through: {
        score,
        feedback
      }
    });

    await project.update({
      status: 'evaluated'
    });

    res.json({ message: 'Evaluation submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};