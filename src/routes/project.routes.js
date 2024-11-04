const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Get all projects
router.get('/', authenticate, projectController.getAllProjects);

router.get('/:id', projectController.getProject);

// Get projects by hackathon
router.get('/hackathon/:hackathonId', authenticate, projectController.getProjectsByHackathon);

// Submit project
router.post('/', authenticate, projectController.submitProject);

// Get project evaluations
router.get('/:projectId/evaluations', authenticate, projectController.getProjectEvaluations);

// Calculate final score
router.post('/:projectId/calculate-score', authenticate, authorize('jury'), projectController.calculateProjectScore);

module.exports = router;