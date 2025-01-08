require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});


const employees= sequelize.define('employees',{
    min:{type:DataTypes.STRING , defaultValue:""},
    operator:{type:DataTypes.STRING , defaultValue:""},
    max:{type:DataTypes.STRING, defaultValue:""},
    emp_count_type:{type:DataTypes.STRING , defaultValue:""},
    emp_category :{type:DataTypes.JSON, defaultValue:""},
    department_name:{type:DataTypes.STRING, defaultValue:""},
    law:{type:DataTypes.STRING, defaultValue:""},
    description:{type:DataTypes.STRING, defaultValue:""},
    section:{type:DataTypes.STRING, defaultValue:""}
});


sequelize.sync({alter:true})
.then(()=>{
  console.log('Employee table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = employees;