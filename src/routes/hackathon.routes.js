const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathon.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/', hackathonController.getAllHackathons);
router.get('/:id', hackathonController.getHackathonById);

// Protected routes - require authentication
router.get('/:id/statistics', authenticate, hackathonController.getHackathonStatistics);
router.get('/:id/export', authenticate, authorize('organizer'), hackathonController.exportHackathonData);

// Protected routes - only organizers can modify hackathons
router.post('/', authenticate, authorize('organizer'), hackathonController.createHackathon);
router.put('/:id', authenticate, authorize('organizer'), hackathonController.updateHackathon);
router.delete('/:id', authenticate, authorize('organizer'), hackathonController.deleteHackathon);

module.exports = router;