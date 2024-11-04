export interface Team {
  id: number;
  name: string;
  description?: string;
  hackathonId: number;
  Users: TeamMember1[];
  Project?: Project;
  Mentors: Mentor[];
  MentoringSessions: MentoringSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember1 {
  id: number;
  userId: number;
  name: string;
  email: string;
  role: string;
  joinedAt: Date;
}

export interface Mentor {
  id: number;
  expertise: string[];
  assignedAt: Date;
}

export interface MentoringSession {
  id: number;
  mentorId: number;
  teamId: number;
  startTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  status: 'draft' | 'submitted' | 'evaluated';
}