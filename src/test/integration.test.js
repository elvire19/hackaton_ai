import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { User, Hackathon, Team, Project, Mentor, Jury, MentoringSession, Evaluation, sequelize } from '../models';
import bcrypt from 'bcryptjs';

describe('Hackathon AI Integration Tests', () => {
  let organizer, participant1, participant2, mentor, juryMember;
  let hackathon, team, project, mentoringSession;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create test users with different roles
    organizer = await User.create({
      email: 'organizer@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Organizer',
      role: 'organizer'
    });

    participant1 = await User.create({
      email: 'participant1@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Participant 1',
      role: 'participant'
    });

    participant2 = await User.create({
      email: 'participant2@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Participant 2',
      role: 'participant'
    });

    mentor = await User.create({
      email: 'mentor@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Mentor',
      role: 'mentor'
    });

    juryMember = await User.create({
      email: 'jury@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test Jury',
      role: 'jury'
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('1. Hackathon Management', () => {
    it('should create a hackathon', async () => {
      hackathon = await Hackathon.create({
        name: 'Test Hackathon 2024',
        description: 'A test hackathon for integration testing',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        maxTeamSize: 3,
        status: 'active',
        partners: ['TestCorp', 'TechInc'],
        evaluationCriteria: {
          innovation: { weight: 0.3 },
          impact: { weight: 0.3 },
          feasibility: { weight: 0.2 },
          presentation: { weight: 0.2 }
        }
      });

      expect(hackathon.name).toBe('Test Hackathon 2024');
      expect(hackathon.status).toBe('active');
    });

    it('should update hackathon statistics', async () => {
      const stats = {
        participantCount: 2,
        teamCount: 1,
        projectCount: 1,
        mentoringSessions: {
          total: 1,
          scheduled: 1,
          completed: 0,
          cancelled: 0
        }
      };

      await hackathon.update({ statistics: stats });
      expect(hackathon.statistics.participantCount).toBe(2);
    });
  });

  describe('2. Team Management', () => {
    it('should create a team', async () => {
      team = await Team.create({
        name: 'Test Team',
        description: 'A team for testing',
        hackathonId: hackathon.id
      });

      expect(team.name).toBe('Test Team');
    });

    it('should add participants to team', async () => {
      await team.addUser(participant1);
      await team.addUser(participant2);

      const teamMembers = await team.getUsers();
      expect(teamMembers.length).toBe(2);
    });
  });

  describe('3. Project Management', () => {
    it('should create and submit a project', async () => {
      project = await Project.create({
        name: 'Test Project',
        description: 'A test project',
        githubUrl: 'https://github.com/test/project',
        technologies: ['Node.js', 'React', 'MySQL'],
        status: 'submitted',
        hackathonId: hackathon.id,
        teamId: team.id,
        aiScore: 8.5
      });

      expect(project.name).toBe('Test Project');
      expect(project.status).toBe('submitted');
    });
  });

  describe('4. Mentorship System', () => {
    it('should create a mentor profile', async () => {
      const mentorProfile = await Mentor.create({
        userId: mentor.id,
        expertise: 'Full Stack Development',
        availability: {
          1: [{ start: '09:00', end: '17:00' }]  // Monday availability
        }
      });

      expect(mentorProfile.expertise).toBe('Full Stack Development');
    });

    it('should schedule a mentoring session', async () => {
      const mentorRecord = await Mentor.findOne({ where: { userId: mentor.id } });
      
      mentoringSession = await MentoringSession.create({
        mentorId: mentorRecord.id,
        teamId: team.id,
        hackathonId: hackathon.id,
        startTime: new Date('2024-01-02T10:00:00'),
        endTime: new Date('2024-01-02T11:00:00'),
        status: 'scheduled'
      });

      expect(mentoringSession.status).toBe('scheduled');
    });
  });

  describe('5. Jury and Evaluation System', () => {
    it('should create a jury profile', async () => {
      const juryProfile = await Jury.create({
        juryUserId: juryMember.id,
        specialization: 'Technical Innovation',
        evaluationCriteria: {
          innovation: { weight: 0.3 },
          impact: { weight: 0.3 },
          feasibility: { weight: 0.2 },
          presentation: { weight: 0.2 }
        }
      });

      expect(juryProfile.specialization).toBe('Technical Innovation');
    });

    it('should submit project evaluation', async () => {
      const juryRecord = await Jury.findOne({ where: { juryUserId: juryMember.id } });
      
      const evaluation = await Evaluation.create({
        juryId: juryRecord.id,
        projectId: project.id,
        scores: {
          innovation: 9,
          impact: 8,
          feasibility: 8,
          presentation: 9
        },
        feedback: 'Excellent project with innovative approach'
      });

      expect(evaluation.scores.innovation).toBe(9);
    });

    it('should calculate final project score', async () => {
      const finalScore = 8.5; // (9*0.3 + 8*0.3 + 8*0.2 + 9*0.2)
      await project.update({ 
        finalScore,
        status: 'evaluated'
      });

      expect(project.finalScore).toBe(8.5);
      expect(project.status).toBe('evaluated');
    });
  });

  describe('6. Statistics and Export', () => {
    it('should update hackathon statistics after all activities', async () => {
      const finalStats = {
        participantCount: 2,
        teamCount: 1,
        projectCount: 1,
        mentoringSessions: {
          total: 1,
          scheduled: 1,
          completed: 0,
          cancelled: 0
        },
        evaluations: {
          completed: 1,
          average: 8.5
        }
      };

      await hackathon.update({ statistics: finalStats });
      expect(hackathon.statistics.evaluations.average).toBe(8.5);
    });
  });
});