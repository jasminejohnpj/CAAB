require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false
});

const documents = sequelize.define('documents',{
  act:{type:DataTypes.STRING,defaultValue:"" },
  document_description:{type:DataTypes.STRING,defaultValue:"" },
  penalty_description:{type:DataTypes.STRING,defaultValue:"" },
  penalty_amount:{type:DataTypes.STRING,defaultValue:"" },
  penalty_point:{type:DataTypes.STRING,defaultValue:"" }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('documents table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = documents;