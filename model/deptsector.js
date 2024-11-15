require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const deptsector= sequelize.define('deptsector',{
  dept_name:{type:DataTypes.STRING,defaultValue:"" },
  sector_name:{type:DataTypes.STRING,defaultValue:"" }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('deptsector table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=deptsector;