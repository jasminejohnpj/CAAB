require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false
});

const laws = sequelize.define('law',{
    department_name:{type:DataTypes.STRING},
    law:{type:DataTypes.STRING },
    act_rule:{type:DataTypes.STRING },
    section:{type:DataTypes.STRING},
    penalty_amount:{type:DataTypes.INTEGER},
    due_date:{type:DataTypes.STRING},
    alert_date:{type:DataTypes.STRING},
    

},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Law table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = laws;