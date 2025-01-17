require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const db = require('./db');

const company= db.define('company',{
  company_name:{type:DataTypes.STRING,defaultValue:"" },
  city:{type:DataTypes.STRING,defaultValue:"" },
  district:{type:DataTypes.STRING,defaultValue:"" },
  sector:{type:DataTypes.STRING,defaultValue:"" },
  email:{type:DataTypes.STRING,defaultValue:"" },
  mobile_number:{type:DataTypes.STRING,defaultValue:"" },
  no_of_labour:{type:DataTypes.INTEGER,defaultValue:0},
  no_of_females:{type:DataTypes.INTEGER,defaultValue:0 },
  no_of_males:{type:DataTypes.INTEGER,defaultValue:0},
  contact_labours:{type:DataTypes.STRING,defaultValue:"" },
  migrant_labours:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin_mobile:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin_email:{type:DataTypes.STRING,defaultValue:"" },
 status:{type:DataTypes.STRING,defaultValue:"" }
},{timestamps:false});



module.exports=company;