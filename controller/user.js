const express = require("express");
const router = express.Router();
const User = require("../model/user");
const branchAdmin = require('../model/branchAdmin');
const businesstype = require('../model/businesstype');
const { where } = require("sequelize");

router.post('/addCompany', async (req, res) => {
    try {
        const { email, user_name,company_name, mobile, no_of_branch } = req.body;

        const existingUser = await User.findOne({ where: { email, company_name } });
        if (existingUser) {
            return res.status(409).json({ message: "Company already registered" });
        }

        // Fetch the latest caab_id
        const latestUser = await User.findOne({
            order: [['caab_id', 'DESC']], 
        });


        let newCaabId = "CAAB2001"; // Default for the first record

        if (latestUser && latestUser.caab_id) {
            const latestIdNumber = parseInt(latestUser.caab_id.slice(4), 10); 
            newCaabId = `CAAB${(latestIdNumber + 1).toString().padStart(4, '0')}`; 
        }

        // Create a new company record
        const newUser = await User.create({
            caab_id: newCaabId,
            email,
            user_name,
            company_name,
            mobile,
            no_of_branch,
        });

        return res.status(201).json({ message: "Company registered successfully", data: newUser });
    } catch (error) {
        console.error("Error in /addCompany:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get('/companyInfo/:caab_id' , async(req, res) =>{
    try{
        const caab_id = req.params.caab_id;
        if(!caab_id){
            return res.status(400).json({message:"caab id is required"});
        }
        const company = await User.findAll({where: {caab_id: caab_id}});
        if(!company){
            return res.status(404).json({message:"Company not found"});
        }
        return res.status(200).json({message:"company details " , company});
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

router.get('/branchesDetails/:admin_email' , async(req,res) =>{
    try{
        const {admin_email} = req.params;
       const branch = await branchAdmin.findAll({where:{admin_email}});
       if(!branch){
        return res.status(404).json({message:"branch details not found"});

       }
       return res.status(200).json({message:"branch details are:", branch});
    }
    catch(error){
        return res.status(500).json({message:"internal server error"});
    }
});

router.put('/editBranchDetails/:admin_email', async (req, res) => {
    try {
        const { admin_email } = req.params;
        const newdata = req.body;
        const branch = await branchAdmin.findOne({ where: { admin_email } });
        if (!branch) {
            return res.status(404).json({ message: "Branch details not found" });
        }
        await branchAdmin.update(newdata, { where: { admin_email } });

        return res.status(200).json({ message: "Branch details updated successfully" });
    } catch (error) {
        console.error("Error in /editBranchDetails:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete('/removeBranch/:admin_email', async (req, res) => {
    try {
        const { admin_email } = req.params;

        if (!admin_email) {
            return res.status(400).json({ message: "Admin email is required" });
        }

        const branch = await branchAdmin.findOne({ where: { admin_email } });
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }

        await branch.destroy();
        return res.status(200).json({ message: "Branch deleted successfully" });
    } catch (error) {
        console.error("Error in /removeBranch:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = router;