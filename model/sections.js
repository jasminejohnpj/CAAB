require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const sections= sequelize.define('sections',{
    sector_id:{type:DataTypes.INTEGER},
    dept_name:{type:DataTypes.STRING },
    act_id:{type:DataTypes.INTEGER },
    section_no:{type:DataTypes.STRING},
    description :{type:DataTypes.STRING},
    document :{type:DataTypes.STRING},
    penalty_point:{type:DataTypes.INTEGER},
    penalty_amount:{type:DataTypes.INTEGER},
    penalty_descriptions:{type:DataTypes.STRING},
    category:{type:DataTypes.STRING}

},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Sections table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=sections;