require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const questionResponse= db.define('questionResponse',{
    branch_id :{type:DataTypes.STRING,defaultValue:""},
    section:{type:DataTypes.STRING,defaultValue:"" },
    questions:{type:DataTypes.JSON,defaultValue:"" },
    gravity:{type:DataTypes.STRING,defaultValue:""},
    response:{type:DataTypes.STRING,defaultValue:""}
  },{timestamps:false});
  
  
  
  module.exports = questionResponse;