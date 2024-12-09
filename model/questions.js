require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const Questions= sequelize.define('questions',{
  section:{type:DataTypes.STRING,defaultValue:"" },
  questions:{type:DataTypes.JSON,defaultValue:"" },
  gravity:{type:DataTypes.STRING,defaultValue:""}
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('questions table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = Questions;