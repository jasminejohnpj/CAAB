require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const db = require('./db');

const laws = db.define('law',{
    department_name:{type:DataTypes.STRING},
    law:{type:DataTypes.STRING },
    act_rule:{type:DataTypes.STRING },
    section:{type:DataTypes.STRING},
    penalty_amount:{type:DataTypes.INTEGER},
    due_date:{type:DataTypes.STRING},
    alert_date:{type:DataTypes.STRING},
    

},{timestamps:false});



module.exports = laws;