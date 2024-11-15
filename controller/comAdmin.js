const express = require('express');
const router = express.Router();
const company = require('../model/company');


router.post('/addCompany',async(req,res)=>{
    try{
      const {company_name,city,district,sector,email,mobile_number,no_of_labour,no_of_females,mo_of_males,contact_labours,migrant_labours,branch_admin,branch_admin_mobile,branch_admin_email} = req.body;
      const comp = await company.create({
        company_name,
        city,
        district,
        sector,
        email,
        mobile_number,
        no_of_labour,
        no_of_females,
        mo_of_males,
        contact_labours,
        migrant_labours,
        branch_admin,
        branch_admin_mobile,
        branch_admin_email
      });
      return res.status(200).json({message:"company table added successfully",comp});
      }
      catch(error){
        return res.status(500).json({message:"Internal server error",error});
      }
  });