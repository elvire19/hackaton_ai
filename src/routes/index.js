const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const hackathonRoutes = require('./hackathon.routes');
const teamRoutes = require('./team.routes');
const projectRoutes = require('./project.routes');
const mentorRoutes = require('./mentor.routes');
const juryRoutes = require('./jury.routes');
const mentoringRoutes = require('./mentoring.routes');

router.use('/auth', authRoutes);
router.use('/hackathons', hackathonRoutes);
router.use('/teams', teamRoutes);
router.use('/projects', projectRoutes);
router.use('/mentors', mentorRoutes);
router.use('/jury', juryRoutes);
router.use('/mentoring', mentoringRoutes);

module.exports = router;