require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const branchAdmin= sequelize.define('branchAdmin',{
  caab_id:{type:DataTypes.STRING},
  branch_name:{type:DataTypes.STRING, defaultValue:""},
  branch_id:{type:DataTypes.STRING, unique:true},
  branch_email:{type:DataTypes.STRING, defaultValue:""},
  branch_mobile_no:{type:DataTypes.STRING, defaultValue:""},
  branch_admin_name:{type:DataTypes.STRING,defaultValue:"" },
  admin_no:{type:DataTypes.STRING,defaultValue:""},
  admin_email:{type:DataTypes.STRING,defaultValue:""},
  city:{type:DataTypes.STRING,defaultValue:"" },
  district:{type:DataTypes.STRING, defaultValue:""},
  business_type:{type:DataTypes.STRING,defaultValue:"" },
  no_female:{type:DataTypes.STRING,defaultValue:"" },
  //no_male:{type:DataTypes.STRING,defaultValue:""},
  total_employees:{type:DataTypes.STRING,defaultValue:""},
  no_contract:{type:DataTypes.STRING,defaultValue:""},
  no_migrant:{type:DataTypes.STRING,defaultValue:""}
},{timestamps:false});  

sequelize.sync({alter:true})
.then(()=>{
  console.log('branch admin table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = branchAdmin;