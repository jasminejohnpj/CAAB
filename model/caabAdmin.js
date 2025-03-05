require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const caabAdmin = db.define('caabAdmin',{
  user_name:{type:DataTypes.STRING,defaultValue:""},
  password:{type:DataTypes.STRING,defaultValue:"" },
  
 
},{timestamps:false});



module.exports = caabAdmin;

