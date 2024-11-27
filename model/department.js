require('dotenv').config();
const { Timestamp } = require('firebase-admin/firestore');
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const department= sequelize.define('department',{
  dept_name:{type:DataTypes.STRING,defaultValue:"" }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('department table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=department;