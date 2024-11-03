module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
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
    hackathonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hackathons',
        key: 'id'
      }
    }
  });
  
  Team.associate = (models) => {
    Team.belongsTo(models.Hackathon, { foreignKey: 'hackathonId' });
    Team.belongsToMany(models.User, { 
      through: 'TeamMembers',
      foreignKey: 'teamId',
      otherKey: 'userId'
    });
    Team.hasOne(models.Project, { foreignKey: 'teamId' });
    Team.belongsToMany(models.Mentor, { 
      through: 'MentorAssignments',
      foreignKey: 'teamId',
      otherKey: 'mentorId'
    });
    Team.hasMany(models.MentoringSession, { foreignKey: 'teamId' });
  };
  
  return Team;
};