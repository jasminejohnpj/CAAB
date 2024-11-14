const express= require('express');
const cors = require('cors');
const app= express();
const http= require('http');

app.use(cors());
app.use(express.json());

 app.use('/api/v1',require('./router/routing'));

module.exports=app;