const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const teamController = require('../controllers/team.controller');

// Public routes (still require authentication)
router.get('/', authenticate, teamController.getAllTeams);
router.get('/:id', authenticate, teamController.getTeam);

// Team CRUD operations
router.post('/', 
  authenticate, 
  authorize('participant','mentor','organizer'), 
  teamController.createTeam
);

router.put('/:id', 
  authenticate, 
  teamController.updateTeam
);

router.delete('/:id', 
  authenticate, 
  teamController.deleteTeam
);

router.get('/:id/analytics', authenticate, teamController.getTeamAnalytics);


module.exports = router;