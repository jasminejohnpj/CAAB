require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const businesstype= sequelize.define('businesstype',{
  business_type:{type:DataTypes.STRING,defaultValue:"" },
  department_name:{type:DataTypes.JSON,defaultValue:"" }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('business type table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = businesstype;