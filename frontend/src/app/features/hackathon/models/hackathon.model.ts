export interface Hackathon {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    maxTeamSize: number;
    status: 'draft' | 'active' | 'completed';
    partners: Partner[];
    evaluationCriteria: EvaluationCriteria;
    statistics: HackathonStatistics;
  }
  
  export interface Partner {
    id: number;
    name: string;
    logo: string;
    website: string;
  }
  
  export interface EvaluationCriteria {
    innovation: { weight: number };
    impact: { weight: number };
    feasibility: { weight: number };
    presentation: { weight: number };
  }
  
  export interface HackathonStatistics {
    participantCount: number;
    teamCount: number;
    projectCount: number;
    mentoringSessions: {
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
    };
  }