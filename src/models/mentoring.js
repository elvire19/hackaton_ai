module.exports = (sequelize, DataTypes) => {
    const MentoringSession = sequelize.define('MentoringSession', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Mentors',
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
      hackathonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Hackathons',
          key: 'id'
        }
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
      },
      notes: DataTypes.TEXT,
      notificationsSent: {
        type: DataTypes.JSON,
        defaultValue: { reminder: false }
      }
    });
    
    MentoringSession.associate = (models) => {
      MentoringSession.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
      MentoringSession.belongsTo(models.Team, { foreignKey: 'teamId' });
      MentoringSession.belongsTo(models.Hackathon, { foreignKey: 'hackathonId' });
    };
    
    return MentoringSession;
  };