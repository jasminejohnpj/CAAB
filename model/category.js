
require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');


const category= db.define('category',{
    conditions:{type:DataTypes.STRING , defaultValue:""},
    emp_category :{type:DataTypes.JSON, defaultValue:""},
    department_name:{type:DataTypes.STRING, defaultValue:""},
    law:{type:DataTypes.STRING, defaultValue:""},
    description:{type:DataTypes.STRING, defaultValue:""},
    section:{type:DataTypes.STRING, defaultValue:""}
},{timestamps:false});




module.exports = category;
