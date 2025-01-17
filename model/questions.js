require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const Questions= db.define('questions',{
  section:{type:DataTypes.STRING,defaultValue:"" },
  questions:{type:DataTypes.JSON,defaultValue:"" },
  gravity:{type:DataTypes.STRING,defaultValue:""}
},{timestamps:false});



module.exports = Questions;