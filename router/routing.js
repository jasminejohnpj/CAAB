const express= require('express');
const router= express.Router();
const cors= require('cors');
const app= express();
app.use(cors());

app.use('/admin',require('../controller/admin'));
app.use('/user' , require('../controller/user'));


module.exports=app;