export interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  technologies: string[];
  hackathonId: number;
  teamId: number;
  status: ProjectStatus;
  aiScore?: number;
  finalScore?: number;
  team?: {
    id: number;
    name: string;
    users: TeamMember[];
  };
  evaluations?: ProjectEvaluation[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'evaluated';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ProjectEvaluation {
  id: number;
  projectId: number;
  juryId: number;
  scores: {
    innovation: number;
    impact: number;
    feasibility: number;
    presentation: number;
  };
  feedback?: string;
  jury: TeamMember;
  createdAt: Date;
}