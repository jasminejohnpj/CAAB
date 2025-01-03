require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const user= sequelize.define('user',{
  caab_id:{type:DataTypes.STRING, primaryKey:true},
  email:{type:DataTypes.STRING,defaultValue:"" },
  user_name:{type:DataTypes.STRING,defaultValue:""},
  company_name:{type:DataTypes.STRING,defaultValue:"" },
  mobile:{type:DataTypes.STRING,defaultValue:"" },
 employer_category:{ type:DataTypes.STRING,defaultValue:""}
 
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('user table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = user;