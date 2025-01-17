require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');


const employees= db.define('employees',{
    emp_range:{type:DataTypes.STRING , defaultValue:""},
    emp_count_type:{type:DataTypes.STRING , defaultValue:""},
    emp_category :{type:DataTypes.JSON, defaultValue:""},
    department_name:{type:DataTypes.STRING, defaultValue:""},
    law:{type:DataTypes.STRING, defaultValue:""},
    description:{type:DataTypes.STRING, defaultValue:""},
    section:{type:DataTypes.STRING, defaultValue:""}
});




module.exports = employees;