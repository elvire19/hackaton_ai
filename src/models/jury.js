module.exports = (sequelize, DataTypes) => {
  const Jury = sequelize.define('Jury', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    juryUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    evaluationCriteria: {
      type: DataTypes.JSON,
      defaultValue: {
        innovation: { weight: 0.3 },
        impact: { weight: 0.3 },
        feasibility: { weight: 0.2 },
        presentation: { weight: 0.2 }
      }
    }
  });
  
  Jury.associate = (models) => {
    Jury.belongsTo(models.User, { foreignKey: 'juryUserId' });
    Jury.belongsToMany(models.Hackathon, { 
      through: 'HackathonJuries',
      foreignKey: 'juryId',
      otherKey: 'hackathonId'
    });
    Jury.belongsToMany(models.Project, { 
      through: models.Evaluation,
      foreignKey: 'juryId',
      otherKey: 'projectId'
    });
  };
  
  return Jury;
};