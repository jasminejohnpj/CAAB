require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const category= sequelize.define('category',{
    category_name:{type:DataTypes.STRING},
   
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Category table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = category;