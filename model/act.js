require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const acts= sequelize.define('acts',{
    sector_id:{type:DataTypes.INTEGER},
    dept_name:{type:DataTypes.STRING,defaultValue:"" },
    act_name:{type:DataTypes.STRING,defaultValue:"" },
    act_id:{type:DataTypes.INTEGER,primaryKey:true, autoIncrement: true }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Act table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=acts;