const express = require("express");
const router = express.Router();
const User = require("../model/user");
const branchAdmin = require('../model/branchAdmin');
const businesstype = require('../model/businesstype');
const { where } = require("sequelize");
const documents = require('../model/document');




const otpStore = {};
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000); 
}

///////////////// login ///////////////////////////////

router.post('/login', async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return res.status(401).json({ message: "Invalid mobile number" });
        }
        // const existingUser = await User.findOne({mobile});
        // if(!existingUser){
        //     return res.status(400).json({message:"user not found"});
        // }
        const otp = generateOTP();
        otpStore[mobile] = otp;
        console.log(`Generated OTP for ${mobile}: ${otp}`);
        return res.status(200).json({ message: "OTP sent successfully", otp });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error });
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

        delete otpStore[mobile];

        const user = await User.findOne({ where: { mobile } });
        console.log (user);
        let existingUser = null;

        if (user) {
            existingUser = {
                caab_id: user.caab_id || null, // Replace with actual column names
                email: user.email || null,
                user_name: user.user_name || null,
                company_name: user.company_name || null,
                mobile: user.mobile,
                employer_category: user.employer_category || null,
                roll:user.roll
            };
        } else {
            const branch = await branchAdmin.findOne({ where: { branch_mobile_no: mobile } });
            if (branch) {
                existingUser = {
                    caab_id: branch.caab_id || null, // Replace with actual column names
                    branch_name: branch.branch_name || null,
                    branch_id: branch.branch_id || null,
                    branch_mobile_no: branch.branch_mobile_no || null,
                    branch_admin_name: branch.branch_admin_name,
                    admin_no: branch.admin_no || null,
                    admin_email: branch.admin_email || null,
                    city: branch.city || null,
                    district: branch.district || null,
                    business_type: branch.business_type || null,
                    no_female: branch.no_female || null,
                    total_employees: branch.total_employees || null,
                    no_contract: branch.no_contract || null,
                    no_migrant: branch.no_migrant || null,
                    roll:branch.roll
                };
            }
        }

        if (existingUser) {
            return res.status(200).json({
                message: "Login successful",
                activeUser: true,
                existingUser
            });
        } else {
            return res.status(200).json({
                message: "Your account has been created",
                activeUser: false
            });
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

///////////////// Company Reg ////////////////////////////

router.post('/addCompany', async (req, res) => {

    try {
        const { email, user_name, company_name, mobile, employer_category, roll } = req.body;

        const existingUser = await User.findOne({ where: { email, company_name } });
        if (existingUser) {
            return res.status(409).json({ message: "Company already registered" });
        }

        const latestUser = await User.findOne({
            order: [['caab_id', 'DESC']],
        });


        let newCaabId = "CAAB2001"; 

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
            employer_category,
            roll
        });

        return res.status(200).json({ message: "Company registered successfully", data: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get('/companyInfo/:caab_id', async (req, res) => {
    try {
        const { caab_id } = req.params;
        if (!caab_id) {
            return res.status(400).json({ message: "caab id is required" });
        }
        const company = await User.findOne({ where: { caab_id } });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const noOfBranch = await branchAdmin.count({
            where: { caab_id }
        });
        const branchData = await branchAdmin.findAll({
            where: { caab_id },
            attributes: ['business_type'],
        });
        const businessTypes = [...new Set(branchData.map(item => item.business_type))];
        const selectedBusinessType = businessTypes.length > 0 ? businessTypes[0] : null;

        const companyInfo = {
            ...company.dataValues,
            noOfBranch,
            selectedBusinessType
        };

        return res.status(200).json({ message: "company details ", companyInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
});

router.put('/editCompany/:caab_id', async (req, res) => {
    try {
        const { caab_id } = req.params;
        const data = req.body;
        if (!caab_id) {
            return res.status(401).json({ message: "caab id is required" });
        }
        const company = await User.findOne({ where: { caab_id } });
        if (!company) {
            return res.status(402).json({ message: "company not found" });
        }
        const user = await User.update(data, { where: { caab_id } });
        return res.status(200).json({ message: "company details are updated" });
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
});

router.post('/verifySuperAdminOtp', async (req, res) => {
    try {
        const { caab_id, mobile, otp } = req.body;

        if (!caab_id) {
            return res.status(400).json({ message: "CAAB ID is required" });
        }

        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return res.status(401).json({ message: "Invalid mobile number" });
        }

        if (!otp || otp.toString().length !== 4) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const storedOtp = otpStore[mobile];
        if (!storedOtp) {
            return res.status(400).json({ message: "No OTP found for this mobile number" });
        }

        if (storedOtp.toString() !== otp.toString()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        delete otpStore[mobile];

        const existingUser = await User.findOne({ where: { caab_id } });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        existingUser.mobile = mobile; // Assign new value to the `mobile` field
        await existingUser.save();   // Save changes to the database

        return res.status(200).json({
            message: "Mobile number updated successfully",
            phone: [existingUser.mobile]
        });
    } catch (error) {
        console.error("Error in /verifySuperAdminOtp:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/addBranch', async (req, res) => {
    try {
        const { caab_id, branch_name, branch_email, branch_mobile_no, branch_admin_name, admin_no, admin_email, city, district, business_type, no_female, total_employees, no_contract, no_migrant ,roll } = req.body;
        const branch = await branchAdmin.findOne({ where: { admin_email: admin_email } });
        if (branch) {
            return res.status(401).json({ message: "branch already registered" });
        }

        const latestBranch = await branchAdmin.findAll({
            order: [['branch_id', 'desc']],
            limit: 1
        });

        let newBranchId = "br1";

        if (latestBranch.length > 0 && latestBranch[0].branch_id) {
            const latestIdNumber = parseInt(latestBranch[0].branch_id.slice(2));
            newBranchId = `br${(latestIdNumber + 1).toString()}`;
            console.log(newBranchId);
        }
        const newBranch = await branchAdmin.create({
            caab_id,
            branch_id: newBranchId,
            branch_name,
            branch_email,
            branch_mobile_no,
            branch_admin_name,
            admin_no,
            admin_email,
            city,
            district,
            business_type,
            no_female,
            total_employees,
            no_contract,
            no_migrant,
            roll
        });
        return res.status(200).json({ message: "branch added successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/listBranches/:caab_id', async (req, res) => {
    try {
        const { caab_id } = req.params;

        if (!caab_id) {
            return res.status(401).json({ message: "caab id is required" });
        }
        const caabId = await branchAdmin.findOne({where:{caab_id}});
        if(!caabId){
            return res.status(401).json({message:" caab id does not exist, no branches found"});
        }
        const branches = await branchAdmin.findAll({ where: { caab_id } });
        return res.status(200).json({ message: "branches are", branches });
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
});

router.get('/branchDetails/:branch_id', async (req, res) => {
    try {
        const { branch_id } = req.params;
        if(!branch_id){
            return res.status(401).json({message:"branch id required"});
        }
        const branch = await branchAdmin.findOne({where:{branch_id}});
        if(!branch){
            return res.status(404).json({message:"Invalid branch id"});
        }
        const branchDetails = await branchAdmin.findAll({ where: { branch_id } });
        if (!branchDetails) {
            return res.status(404).json({ message: "branch details not found" });
        }
        return res.status(200).json({ message: "branch details are:", branchDetails });
    }
    catch (error) {
        return res.status(500).json({ message: "internal server error" });
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


///////////////////////////// Document Uploading ///////////////////////////

router.post('/newDocument', async (req, res) => {
    try {
        const { branch_id, department_name, document_description, issue_date, expiry_date, licence_no, licence_authority, document_link } = req.body;
        if (!branch_id || !document_link) {
            return res.status(401).json({ message: "branch id and documents are required" });
        }
        const branch = await branchAdmin.findOne({ where: { branch_id } });
        if (!branch) {
            return res.status(403).json({ message: "branch not found" });
        }
        const newDocument = await documents.create({
            branch_id,
            department_name,
            document_description,
            issue_date,
            expiry_date,
            licence_no,
            licence_authority,
            document_link
        });
        return res.status(200).json({ message: "document uploaded successfully" });
    } catch (error) {
        console.log(error)
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
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.delete('/deleteDocument/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({ message: "id required" });
        }
        const doc = await document.findOne({ where: { id } });
        if (!doc) {
            return res.status(400).json({ message: "document not found" });
        }
        await document.destroy({ where: { id } });
        return res.status(200).json({ message: "document deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/branchDocuments/:branch_id', async (req, res) => {
    try {
        const { branch_id } = req.params;
        const branch = await branchAdmin.findOne({ where: { branch_id } });
        if (!branch) {
            return res.status(401).json({ message: "branch id is invalid" });
        }
        const docs = await documents.findAll({ where: { branch_id } });
        if (!docs) {
            return res.status(401).json({ message: "documents not found" });

        }
        return res.status(200).json({ message: "uploaded documents are", data: docs });

    } catch (error) {
        return res.status(500).json({ message: "ïnternal server error" });

    }
});

router.get('/documentById/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ message: "id is required" });
        }
        const docs = await documents.findAll({ where: { id } });
        if (!docs) {
            return res.status(401).json({ message: "invalid id" });
        }
        return res.status(200).json({ data: docs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
    }
});


module.exports = router;