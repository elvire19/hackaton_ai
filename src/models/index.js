'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// User Associations
db.User.belongsToMany(db.Team, { 
  through: 'TeamMembers',
  foreignKey: 'userId',
  otherKey: 'teamId'
});
db.Team.belongsToMany(db.User, { 
  through: 'TeamMembers',
  foreignKey: 'teamId',
  otherKey: 'userId'
});

// User-Mentor Association
db.User.hasOne(db.Mentor, { foreignKey: 'userId' });
db.Mentor.belongsTo(db.User, { foreignKey: 'userId' });

// Hackathon Associations
db.Team.belongsTo(db.Hackathon, { foreignKey: 'hackathonId' });
db.Hackathon.hasMany(db.Team, { foreignKey: 'hackathonId' });

// Project Associations
db.Project.belongsTo(db.Team, { foreignKey: 'teamId' });
db.Team.hasOne(db.Project, { foreignKey: 'teamId' });
db.Project.belongsTo(db.Hackathon, { foreignKey: 'hackathonId' });
db.Hackathon.hasMany(db.Project, { foreignKey: 'hackathonId' });

// Mentor Associations
db.Mentor.belongsToMany(db.Team, { 
  through: 'MentorAssignments',
  foreignKey: 'mentorId',
  otherKey: 'teamId'
});
db.Team.belongsToMany(db.Mentor, { 
  through: 'MentorAssignments',
  foreignKey: 'teamId',
  otherKey: 'mentorId'
});

// Jury Associations
db.Jury.belongsTo(db.User, { foreignKey: 'juryUserId' });
db.User.hasOne(db.Jury, { foreignKey: 'juryUserId' });

db.Jury.belongsToMany(db.Hackathon, { 
  through: 'HackathonJuries',
  foreignKey: 'juryId',
  otherKey: 'hackathonId'
});
db.Hackathon.belongsToMany(db.Jury, { 
  through: 'HackathonJuries',
  foreignKey: 'hackathonId',
  otherKey: 'juryId'
});

// Project Evaluation Associations
db.Project.belongsToMany(db.Jury, { 
  through: db.Evaluation,
  foreignKey: 'projectId',
  otherKey: 'juryId'
});
db.Jury.belongsToMany(db.Project, { 
  through: db.Evaluation,
  foreignKey: 'juryId',
  otherKey: 'projectId'
});

// Mentoring Session Associations
db.MentoringSession.belongsTo(db.Mentor, { foreignKey: 'mentorId' });
db.Mentor.hasMany(db.MentoringSession, { foreignKey: 'mentorId' });

db.MentoringSession.belongsTo(db.Team, { foreignKey: 'teamId' });
db.Team.hasMany(db.MentoringSession, { foreignKey: 'teamId' });

db.MentoringSession.belongsTo(db.Hackathon, { foreignKey: 'hackathonId' });
db.Hackathon.hasMany(db.MentoringSession, { foreignKey: 'hackathonId' });

// Call associate methods if they exist
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;