const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentor.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Get all mentors
router.get('/', authenticate, mentorController.getAllMentors);

// Create mentor
router.post('/', authenticate, authorize('organizer'), mentorController.createMentor);

// Assign mentor to team
router.post('/:mentorId/teams/:teamId', authenticate, authorize('organizer'), mentorController.assignMentorToTeam);

// Get mentor's teams
router.get('/:mentorId/teams', authenticate, mentorController.getMentorTeams);

module.exports = router;