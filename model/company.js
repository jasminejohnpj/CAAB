require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const company= sequelize.define('company',{
  company_name:{type:DataTypes.STRING,defaultValue:"" },
  city:{type:DataTypes.STRING,defaultValue:"" },
  district:{type:DataTypes.STRING,defaultValue:"" },
  sector:{type:DataTypes.STRING,defaultValue:"" },
  email:{type:DataTypes.STRING,defaultValue:"" },
  mobile_number:{type:DataTypes.STRING,defaultValue:"" },
  no_of_labour:{type:DataTypes.INTEGER,defaultValue:0},
  no_of_females:{type:DataTypes.INTEGER,defaultValue:0 },
  no_of_males:{type:DataTypes.INTEGER,defaultValue:0},
  contact_labours:{type:DataTypes.STRING,defaultValue:"" },
  migrant_labours:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin_mobile:{type:DataTypes.STRING,defaultValue:"" },
  branch_admin_email:{type:DataTypes.STRING,defaultValue:"" }
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('Company table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports=company;