module.exports = (sequelize, DataTypes) => {
  const Hackathon = sequelize.define('Hackathon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    maxTeamSize: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed'),
      defaultValue: 'draft'
    },
    partners: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    evaluationCriteria: {
      type: DataTypes.JSON,
      defaultValue: {
        innovation: { weight: 0.3 },
        impact: { weight: 0.3 },
        feasibility: { weight: 0.2 },
        presentation: { weight: 0.2 }
      }
    },
    statistics: {
      type: DataTypes.JSON,
      defaultValue: {
        participantCount: 0,
        teamCount: 0,
        projectCount: 0,
        mentoringSessions: {
          total: 0,
          scheduled: 0,
          completed: 0,
          cancelled: 0
        }
      }
    }
  });
  
  Hackathon.associate = (models) => {
    Hackathon.hasMany(models.Team, { foreignKey: 'hackathonId' });
    Hackathon.hasMany(models.Project, { foreignKey: 'hackathonId' });
    Hackathon.belongsToMany(models.Jury, { 
      through: 'HackathonJuries',
      foreignKey: 'hackathonId',
      otherKey: 'juryId'
    });
    Hackathon.hasMany(models.MentoringSession, { foreignKey: 'hackathonId' });
  };
  
  return Hackathon;
};