module.exports = (sequelize, DataTypes) => {
  const Mentor = sequelize.define('Mentor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: false
    },
    availability: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  });
  
  Mentor.associate = (models) => {
    Mentor.belongsTo(models.User, { foreignKey: 'userId' });
    Mentor.belongsToMany(models.Team, { 
      through: 'MentorAssignments',
      foreignKey: 'mentorId',
      otherKey: 'teamId'
    });
    Mentor.hasMany(models.MentoringSession, { foreignKey: 'mentorId' });
  };
  
  return Mentor;
};