require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false
});

const sector= sequelize.define('sector',{
  sector_name:{type:DataTypes.STRING,defaultValue:"" },
  sector_id:{type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('sector table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=sector;