const express = require('express');
const router = express.Router();
const juryController = require('../controllers/jury.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Get all juries
router.get('/', authenticate, authorize('organizer'), juryController.getAllJuries);

// Create jury member
router.post('/', authenticate, authorize('organizer'), juryController.createJury);

// Submit evaluation
router.post('/evaluate/:projectId', authenticate, authorize('jury'), juryController.submitEvaluation);

module.exports = router;