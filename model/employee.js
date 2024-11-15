require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const employee= sequelize.define('employee',{
  name:{type:DataTypes.STRING,defaultValue:"" },
  role_name:{type:DataTypes.STRING,defaultValue:"" },
  mobile_number:{type:DataTypes.STRING,defaultValue:"" },
  aadhar:{type:DataTypes.STRING,defaultValue:"" },
  address:{type:DataTypes.STRING,defaultValue:"" },
  image:{type:DataTypes.STRING,defaultValue:"" },
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Employee table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=employee;