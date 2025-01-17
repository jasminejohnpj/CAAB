require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const db = require('./db');

const roles= db.define('role',{
  role_name:{type:DataTypes.STRING,defaultValue:"" },
  access:{type:DataTypes.JSON,defaultValue:[] },
  allowed_routes:{type:DataTypes.JSON,defaultValue:[]}
},{timestamps:false});



module.exports=roles;