require('dotenv').config();
const http=require('http');
const Sequelize=require('sequelize');
const app=require('./index');

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST
});

const server=http.createServer(app)

sequelize.authenticate()
.then(()=>{
  console.log('Connected to the database');
})
.catch((err)=>{
  console.error('Unable to connect to database:',err);
})

server.listen(process.env.SERVER_PORT,() =>{
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});