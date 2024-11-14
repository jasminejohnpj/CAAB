const express= require('express');
const router= express.Router();
const cors= require('cors');
const app= express();
app.use(cors());

app.use('/admin',require('../controller/admin'));
module.exports=app;