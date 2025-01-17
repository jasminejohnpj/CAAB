require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const db = require('./db');

const documents= db.define('documents',{
  branch_id:{type:DataTypes.STRING,defaultValue:"" },
  department_name:{type:DataTypes.STRING,defaultValue:"" },
  document_description :{type:DataTypes.STRING, defaultValue:""},
  issue_date :{type:DataTypes.STRING, defaultValue:""},
  expiry_date:{type:DataTypes.STRING, defaultValue:""},
  licence_no:{type:DataTypes.STRING, defaultValue:""},
  licence_authority:{type:DataTypes.STRING, defaultValue:""},
  document_link:{type:DataTypes.TEXT, defaultValue:""}
},{timestamps:false});



module.exports = documents;