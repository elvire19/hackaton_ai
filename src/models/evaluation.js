module.exports = (sequelize, DataTypes) => {
    const Evaluation = sequelize.define('Evaluation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      juryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Juries',
          key: 'id'
        }
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
      scores: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          innovation: 0,
          impact: 0,
          feasibility: 0,
          presentation: 0
        }
      },
      feedback: DataTypes.TEXT,
      biasScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      }
    });
    
    Evaluation.associate = (models) => {
      Evaluation.belongsTo(models.Jury, { foreignKey: 'juryId' });
      Evaluation.belongsTo(models.Project, { foreignKey: 'projectId' });
    };
    
    return Evaluation;
  };