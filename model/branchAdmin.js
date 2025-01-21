require('dotenv').config();
const { DataTypes, Sequelize } = require('sequelize');


const db = require('./db');

const branchAdmin = db.define('branchAdmin', {
  caab_id: { type: DataTypes.STRING },
  branch_name: { type: DataTypes.STRING, defaultValue: "" },
  branch_id: { type: DataTypes.STRING, unique: true },
  branch_email: { type: DataTypes.STRING, defaultValue: "" },
  branch_mobile_no: { type: DataTypes.STRING, defaultValue: "" },
  branch_admin_name: { type: DataTypes.STRING, defaultValue: "" },
  admin_no: { type: DataTypes.STRING, defaultValue: "" },
  admin_email: { type: DataTypes.STRING, defaultValue: "" },
  city: { type: DataTypes.STRING, defaultValue: "" },
  district: { type: DataTypes.STRING, defaultValue: "" },
  business_type: { type: DataTypes.STRING, defaultValue: "" },
  no_female: { type: DataTypes.STRING, defaultValue: "" },
  //no_male:{type:DataTypes.STRING,defaultValue:""},
  total_employees: { type: DataTypes.STRING, defaultValue: "" },
  no_contract: { type: DataTypes.STRING, defaultValue: "" },
  no_migrant: { type: DataTypes.STRING, defaultValue: "" },
  role:{type:DataTypes.STRING, defaultValue:""}
}, { timestamps: false });



module.exports = branchAdmin;