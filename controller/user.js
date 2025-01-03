const express = require("express");
const router = express.Router();
const User = require("../model/user");
const branchAdmin = require('../model/branchAdmin');
const businesstype = require('../model/businesstype');
const { where } = require("sequelize");
const documents = require('../model/document');


const otpStore = {};
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
}

router.post('/login',async(req,res) =>{
    try{
        const {mobile} = req.body;
        if(!mobile ||  !/^\d{10}$/.test(mobile)) {
            return res.status(401).json({message:"Invalid mobile number"});
        }
        // const existingUser = await User.findOne({mobile});
        // if(!existingUser){
        //     return res.status(400).json({message:"user not found"});
        // }
        const otp = generateOTP();
        otpStore[mobile] = otp;
        console.log(`Generated OTP for ${mobile}: ${otp}`); 
        return res.status(200).json({message:"OTP sent successfully",otp});
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error",error});
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return res.status(401).json({ message: "Invalid mobile number" });
        }

        if (!otp || otp.toString().length !== 4) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const storedOtp = otpStore[mobile];
        if (!storedOtp) {
            return res.status(400).json({ message: 'No OTP found for this mobile number' });
        }

        if (storedOtp.toString() !== otp.toString()) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        console.log( mobile, otp );
        delete otpStore[mobile];

            
        const existingUser = await User.findOne({ where: { mobile } });

        if (existingUser) {
            return res.status(200).json({
                message: "Login successful",
                activeUser: true,
                data: existingUser
            });
        } else {
            return res.status(200).json({ message: "your account has been created", activeUser: false });
        }
    } catch (error) {
        console.error("Error in /verify-otp:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
});

router.post('/addCompany', async (req, res) => {

    try {
        const { email, user_name,company_name, mobile , employer_category } = req.body;

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
            employer_category
        });

        return res.status(200).json({ message: "Company registered successfully",data: newUser });
    } catch (error) { 
        console.log( error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
  
router.get('/companyInfo/:caab_id' , async(req, res) =>{
    try{
        const {caab_id }= req.params;
        if(!caab_id){
            return res.status(400).json({message:"caab id is required"});
        }
        const company = await User.findOne({where: { caab_id}});
        if(!company){
            return res.status(404).json({message:"Company not found"});
        }
        const noOfBranch = await branchAdmin.count({
            where: { caab_id }
          });
          const companyInfo = {
            ...company.dataValues,
            noOfBranch
        };

        return res.status(200).json({message:"company details " ,companyInfo});
    } catch(error){
       //
       //  console.log(error);
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

router.post('/addBranch',async(req,res)=>{
    try{
        const {caab_id,branch_name,branch_email,branch_mobile_no,branch_admin_name,admin_no,admin_email, city,district,business_type,no_female,total_employees,no_contract,no_migrant} = req.body;
        const branch = await branchAdmin.findOne({where:{admin_email:admin_email}});
        if(branch){
         return   res.status(401).json({message:"branch already registered"});
        }
        
        const latestBranch = await branchAdmin.findAll({
            order:[['branch_id','desc']],
            limit:1
        });

        let newBranchId = "br1";

        if(latestBranch.length>0 && latestBranch[0].branch_id){
            const latestIdNumber = parseInt(latestBranch[0].branch_id.slice(2));
            newBranchId = `br${(latestIdNumber + 1).toString()}`;
            console.log(newBranchId);
        }
       // const femaleCount = Number(no_female)|| 0;
        //const maleCount = Number(no_male) || 0;
        const newBranch = await branchAdmin.create({
            caab_id,
            branch_name,
            branch_id : newBranchId,
            branch_email,
            branch_mobile_no,
            branch_admin_name,
            admin_no,
            admin_email,
            city,
            district,
            business_type,
            no_female ,
           // no_male: maleCount,
           
            total_employees ,
            no_contract,
            no_migrant
        });
        return res.status(200).json({message:"branch added successfully"});
        }
        catch(error){
            console.log(error);
         return   res.status(500).json({message:"Internal server error"});
        }
});

router.get('/branches/:caab_id' , async (req,res) =>{
    try{
        const {caab_id} = req.params;
       // console.log(caab_id);
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

router.get('/branchesDetails/:branch_id' , async(req,res) =>{
    try{
        const {branch_id} = req.params;
       const branch = await branchAdmin.findAll({where:{branch_id}});
       if(!branch){
        return res.status(404).json({message:"branch details not found"});

       }
       return res.status(200).json({message:"branch details are:", branch});
    }
    catch(error){
        return res.status(500).json({message:"internal server error"});
    }
});

router.put('/editBranchDetails/:branch_id', async (req, res) => {
    try {
        const { branch_id } = req.params;
        const newdata = req.body;
        const branch = await branchAdmin.findOne({ where: { branch_id } });
        if (!branch) {
            return res.status(404).json({ message: "Branch details not found" });
        }
        await branchAdmin.update(newdata, { where: { branch_id } });

        return res.status(200).json({ message: "Branch details updated successfully" });
    } catch (error) {
        console.error("Error in /editBranchDetails:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete('/removeBranch/:branch_id', async (req, res) => {
    try {
        const { branch_id } = req.params;

        if (!branch_id) {
            return res.status(400).json({ message: "Admin email is required" });
        }

        const branch = await branchAdmin.findOne({ where: { branch_id } });
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

router.post('/newDocument' , async(req,res) =>{
    try{
        const {branch_id,department_name,document_description,issue_date,expiry_date,licence_no,licence_authority,document_link} = req.body;
        if(!branch_id || !document_link){
            return res.status(401).json({message:"branch id and documents are required"});
        }
        const branch = await branchAdmin.findOne({where:{branch_id}});
        if(!branch){
            return res.status(403).json({message:"branch not found"});
        }
         const newDocument= await documents.create({
            branch_id,
            department_name,
            document_description,
            issue_date,
            expiry_date,
            licence_no,
            licence_authority,
            document_link
         });
         return res.status(200).json({message:"document uploaded successfully"});
    } catch(error){
        return res.status(500).json("internal server error");
    }
});

router.put('/editDocument/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const newdata = req.body;
        const document = await documents.findOne({ where: { id } });
        if (!document) {
            return res.status(404).json({ message: "document not found" });
        }
        await documents.update(newdata, { where: { id } });

        return res.status(200).json({ message: "document updated successfully" });
    } catch (error) {
        console.error( error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete('/deleteDocument/:id',async (req,res) =>{
    try{
        const id = req.params.id;
        if(!id){
            return res.status(401).json({message:"id required"});
        }
        const doc = await document.findOne({where:{id}});
        if(!doc){
            return res.status(400).json({message:"document not found"});
        }
        await document.destroy({where:{id}});
        return res.status(200).json({message:"document deleted successfully"});
        }
        catch(error){
            return res.status(500).json({message:"Internal server error",error});
        }
}); 

router.get('/branchDocuments/:branch_id' , async(req,res) =>{
    try{
        const { branch_id } = req.params;
        const branch = await branchAdmin.findOne({where:{branch_id}});
        if(!branch){
            return res.status(401).json({message:"branch id is invalid"});
        }
        const docs = await documents.findAll({where:{branch_id}});
        if(!docs)
        {
            return res.status(401).json({message:"documents not found"});

        }
        return res.status(200).json({message:"uploaded documents are" , data: docs});

    } catch(error){
        return res.status(500).json({message:"ïnternal server error"});

    }
});
  
router.get('/documentById/:id' , async(req,res) =>{
    try{
        const { id } = req.params;
        if(!id){
            return res.status(401).json({message:"id is required"});
        }
        const docs = await documents.findAll({where:{id}});
        if(!docs){
            return res.status(401).json({message:"invalid id"});
        }
        return res.status(200).json({data:docs});
    } catch(error){
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
});


module.exports = router;