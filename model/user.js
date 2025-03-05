require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const user= db.define('user',{
  caab_id:{type:DataTypes.STRING, primaryKey:true},
  email:{type:DataTypes.STRING,defaultValue:"" },
  user_name:{type:DataTypes.STRING,defaultValue:""},
  company_name:{type:DataTypes.STRING,defaultValue:"" },
  mobile:{type:DataTypes.STRING,defaultValue:"" },
  employer_category:{ type:DataTypes.STRING,defaultValue:""},
  role:{type:DataTypes.STRING, defaultValue:""}
 
},{timestamps:false});



module.exports = user;

