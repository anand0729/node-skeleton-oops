const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize("crudapp", "root", null, { 
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

db.sequelize = sequelize;
db.Sequelize = Sequelize; 

module.exports = db;