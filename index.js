const express= require('express');
const cors = require('cors');
const app= express();
const http= require('http');
app.use(express.json({ limit: "10mb" }));

app.use(cors());

 app.use('/api/v1',require('./router/routing'));

module.exports=app;