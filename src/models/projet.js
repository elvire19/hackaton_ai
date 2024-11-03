module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
    githubUrl: DataTypes.STRING,
    demoUrl: DataTypes.STRING,
    technologies: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'submitted', 'evaluated'),
      defaultValue: 'in_progress'
    },
    hackathonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hackathons',
        key: 'id'
      }
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id'
      }
    },
    aiScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    finalScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    scores: {
      type: DataTypes.JSON,
      defaultValue: {
        innovation: 0,
        impact: 0,
        feasibility: 0,
        presentation: 0
      }
    },
    feedback: DataTypes.TEXT
  });
  
  Project.associate = (models) => {
    Project.belongsTo(models.Team, { foreignKey: 'teamId' });
    Project.belongsTo(models.Hackathon, { foreignKey: 'hackathonId' });
    Project.belongsToMany(models.Jury, { 
      through: models.Evaluation,
      foreignKey: 'projectId',
      otherKey: 'juryId'
    });
  };
  
  return Project;
};