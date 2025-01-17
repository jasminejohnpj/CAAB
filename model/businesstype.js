require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const businesstype= db.define('businesstype',{
  business_type:{type:DataTypes.STRING,defaultValue:"" },
  department_name:{type:DataTypes.JSON,defaultValue:"" }
},{timestamps:false});



module.exports = businesstype;