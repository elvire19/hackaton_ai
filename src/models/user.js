module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('participant', 'organizer', 'jury', 'mentor'),
      defaultValue: 'participant'
    }
  });
  
  User.associate = (models) => {
    User.belongsToMany(models.Team, { 
      through: 'TeamMembers',
      foreignKey: 'userId',
      otherKey: 'teamId'
    });
    User.hasOne(models.Mentor, { foreignKey: 'userId' });
    User.hasOne(models.Jury, { foreignKey: 'juryUserId' });
  };
  
  return User;
};