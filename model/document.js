require('dotenv').config();
const {DataTypes,Sequelize}= require('sequelize');
const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  logging:false

});

const documents= sequelize.define('documents',{
  branch_id:{type:DataTypes.STRING,defaultValue:"" },
  department_name:{type:DataTypes.STRING,defaultValue:"" },
  document_description :{type:DataTypes.STRING, defaultValue:""},
  issue_date :{type:DataTypes.STRING, defaultValue:""},
  expiry_date:{type:DataTypes.STRING, defaultValue:""},
  licence_no:{type:DataTypes.STRING, defaultValue:""},
  licence_authority:{type:DataTypes.STRING, defaultValue:""},
  document_link:{type:DataTypes.STRING, defaultValue:""}
},{timestamps:false});

sequelize.sync({alter:true})
.then(()=>{
  console.log('document type table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

module.exports = documents;