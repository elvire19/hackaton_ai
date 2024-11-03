const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);

// Protected routes
router.post('/', authenticate, authorize('organizer'), teamController.createTeam);
router.put('/:id', authenticate, authorize('organizer'), teamController.updateTeam);

// Team member management
router.post('/:teamId/users/:userId', authenticate, teamController.addUserToTeam);
router.delete('/:teamId/users/:userId', authenticate, teamController.removeUserFromTeam);

// Team recommendations
router.get('/recommend/:hackathonId/:teamSize', authenticate, authorize('organizer'), teamController.recommendTeams);

module.exports = router;