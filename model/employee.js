require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const employee= sequelize.define('employee',{
  emp_no:{type:DataTypes.STRING,defaultValue:"" },
  sex:{type:DataTypes.STRING,defaultValue:"" },
  employee_type:{type:DataTypes.JSON,defaultValue:"" },
  department_name:{type:DataTypes.STRING,defaultValue:"" },
  law:{type:DataTypes.STRING,defaultValue:"" },
  description:{type:DataTypes.STRING,defaultValue:"" },
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Employee table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = employee;