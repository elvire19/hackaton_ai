const express = require('express');
const router = express.Router();
const mentoringController = require('../controllers/mentoring.controller');
const mentorController = require('../controllers/mentor.controller');

const { authenticate, authorize } = require('../middleware/auth.middleware');

// Get sessions by hackathon
router.get('/hackathon/:hackathonId', authenticate, mentoringController.getSessionsByHackathon);

//Get all Mentors
router.get('/mentors', authenticate, mentorController.getAllMentors);


// Get available slots for mentor
router.get('/mentor/:mentorId/available-slots', authenticate, mentoringController.getAvailableSlots);

// Book a session
router.post('/book', authenticate, authorize('participant'), mentoringController.bookSession);

// Create session (for mentors/organizers)
router.post('/', authenticate, authorize(['mentor', 'organizer']), mentoringController.createSession);

// Update session status
router.patch('/:sessionId/status', authenticate, mentoringController.updateSessionStatus);

// Cancel booking
router.delete('/:sessionId/cancel', authenticate, mentoringController.cancelBooking);

module.exports = router;