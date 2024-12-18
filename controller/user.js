const express = require("express");
const router = express.Router();
const User = require("../model/user");
const branchAdmin = require('../model/branchAdmin');
const businesstype = require('../model/businesstype');
const { where } = require("sequelize");

router.post('/addCompany', async (req, res) => {
    try {
        const { email, company_name, mobile, no_of_branch } = req.body;
        const user = await User.findOne({ where: { email, company_name } });
        if (user) {
            return res.status(409).json({ message: "Company already registered" });
        }

        // Generate cab_id - fetch the latest cab_id
        const latestUser = await User.findAll({
            order: [['cab_id', 'DESC']],
            limit: 1
        });

        let newCabId = "CAAB2001"; 

        if (latestUser.length > 0 && latestUser[0].cab_id) {
            const latestIdNumber = parseInt(latestUser[0].cab_id.slice(4));
            newCabId = `CAAB${(latestIdNumber + 1).toString()}`;
            console.log(newCabId);
        }
        const newUser = await User.create({
            cab_id: newCabId,
            email,
            company_name,
            mobile,
            no_of_branch,
        });

        return res.status(201).json({ message: "Company registered successfully" });
    } catch (error) {
        console.error("Error in /addCompany:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get('/companyInfo/:cab_id' , async(req, res) =>{
    try{
        const cab_id = req.params.cab_id;
        if(!cab_id){
            return res.status(400).json({message:"cab id is required"});
        }
        const company = await User.findAll({where: {cab_id: cab_id}});
        if(!company){
            return res.status(404).json({message:"Company not found"});
        }
        return res.status(200).json({message:"company details " , company});
    } catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error",error});
    }
});

router.post('/addBranch', async (req, res) => {
    try {
        const {
            caab_id,
            branch_admin_name,
            admin_no,
            admin_email,
            city,
            business_type,
            no_female,
            no_male,
            contract,
            migrant
        } = req.body;       

        const User = await branchAdmin.findOne({where:{ admin_email: admin_email }});
        if (User) {
            return res.status(409).json({ message: "Branch already registered" });
        }

        const femaleCount = Number(no_female) || 0;
        const maleCount = Number(no_male) || 0;

        const newUser = await branchAdmin.create({
            caab_id,
            branch_admin_name,
            admin_no,
            admin_email,
            city,
            business_type,
            no_female: femaleCount,
            no_male: maleCount,
            total_employees: femaleCount + maleCount,
            contract,
            migrant
        });

        return res.status(201).json({ message: "Branch registered successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get('/branches/:caab_id' , async (req,res) =>{
    try{
        const {caab_id} = req.params;
        console.log(caab_id);
        if(!caab_id){
            return res.status(400).json({message:"company id is required"});
        } 
        const branches = await branchAdmin.findAll({where: { caab_id: caab_id}});
         if(!branches){
            return res.status(404).json({message:"No branches found"});
         }
         return res.status(200).json({message:"branches of company " , branches});

        } catch(error){
            console.log(error);
            return res.status(500).json({message:"Internal server error",error});
        }
});
router.get('/departments/:business_type',async(req,res)=>{
    try{
        const businessType = req.params.business_type;
        if(!businessType){
            return res.status(401).json({message:"business type required"});
        }
        const departments = await businesstype.findOne({where:{business_type: businessType},attributes:['department_name']});
        if(!departments){
            return res.status(400).json({message:"departments does not exist under the business type"});
        }
        return res.status(200).json({message:"departments under the business type",departments});
        }
        catch(error){
            return res.status(500).json({message:"Internal server error",error});
        }
});



module.exports = router;