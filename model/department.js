require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const department= db.define('department',{
  department_name:{type:DataTypes.STRING,defaultValue:"" },
  department_type:{type:DataTypes.STRING,defaultValue:"" },
  appropriate_govt:{type:DataTypes.STRING,defaultValue:"" },
},{timestamps:false});



module.exports = department;