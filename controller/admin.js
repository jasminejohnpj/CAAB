const express = require('express');
const router = express.Router();
const sector = require('../model/sector');
const dept = require('../model/department');
const act = require('../model/act');
const deptsector = require('../model/deptsector');
const roles = require('../model/role');
const employee = require('../model/employee');
const sections = require('../model/section');
const documents = require('../model/documents');
const { where } = require('sequelize');
//const multer = require("multer")
//var admin = require("firebase-admin");
//var serviceAccount = require("../service.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

//const upload = multer({dest: 'uploads/'})
//const storage = admin.storage().bucket();
           ////////////////////// Add Sector  ///////////////////////
router.post('/addSector',async(req,res)=>{
  try{
    const{sector_name}=req.body;
    await sector.create({sector_name});
    return res.status(200).json({message:'Data added successfully'});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.get('/listSector',async(req,res)=>{
  try{
    const data = await sector.findAll();
    return res.status(200).json({message:"List of sectors",data});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

 router.put('/updateSector/:id',async(req,res)=>{
  try{
    const id = req.params.id;
    const value=req.body;
    if(!id){
      return res.status(404).json({message:"id not found"});
    }
    const idsector = await sector.findOne({where:{id}});
    if(!idsector){
      return res.status(401).json({message:"sector id not existing"});
    }
    await sector.update(value,{where:{id}});
    return res.status(200).json({message:'updated',value});
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"});
  }
});

router.delete('/deleteSector/:id',async(req,res)=>{
  try{
    const id= req.params.id;
    if(!id){
      return res.status(500).json({message:"id not found"})
    }
    const idsector = await sector.findOne({where:{id}});
    if(!idsector){
      return res.status(401).json({message:"sector id not existing"});
    }
    await idsector.destroy();
    return res.status(200).json({message:"data successfully deleted"});
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"});
  }
});

           ///////////////////// Add Department //////////////////////
router.post('/addDept',async(req,res)=>{
  try{
    const {dept_name}=req.body;
    await dept.create({dept_name});
    return res.status(200).json({message:"Dept added successfully"});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.get('/listDept',async(req,res)=>{
  try{
    const data=await dept.findAll();
    return res.status(200).json({message:"department list",data});
  }
  catch(error){
    return res.status(500).json({message:"internal server error",error});
  }
 });

 router.put('/updateDept/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const value = req.body;

    // Check if id is provided and valid
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid or missing id" });
    }

    // Check if the department exists
    const department = await dept.findOne({ where: { id } });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update the department data
    await dept.update(value, { where: { id } });
    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});


router.delete('/deleteDept/:id',async(req,res)=>{
  try{
    const id=req.params.id;
    if(!id){
      return res.status(404).json({message:"id not found"});
    }
    const department = await dept.findOne({ where: { id } });
    if(!department){
      return res.status(404).json({message:"Department not found"});
    }
    const valueid=await dept.findOne({where:{id}});
    await valueid.destroy();
    return res.status(200).json({message:'data deleted'})
  }
  catch(error){
    return res.status(500).json({message:"Internal server error,error"});
  }
 });


       //////////////////////////  Add Act ////////////////////////////////
router.post('/addActs',async(req,res)=>{
  try{
    const data=req.body;
    await act.create(data);
    return res.status(200).json({message:"acts added successfully",data});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.get('/listActs',async(req,res)=>{
  try{
    const data=await act.findAll();
    return res.status(200).json({message:"List of acts",data});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

 router.put('/updateActs/:id',async(req,res)=>{
  try{
    const id=req.params.id;
    const value=req.body;
    if(!id){
      return res.status(404).json({message:"id not found"});
    }
    const idacts = await act.findOne({where:{id}});
    if(!idacts){
      return res.status(404).json({message:"act id not existing"});
    }
    await act.update(value,{where:{id}});
    return res.status(200).json({message:"Updated acts"});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
});
router.delete('/deleteActs/:id',async(req,res)=>{
  try{
    const id = req.params.id;
    if(!id){
      return res.status(404).json({message:"id not found"});
    }
    const actid = await act.findOne({where:{id}});
    if(!actid){
      return res.status(401).json({message:"id not existing"});
    }
    await actid.destroy();
    return res.status(200).json({message:"deleted successfully"});
  }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
});

    ////////////// Add Section ////////////////////////
router.post('/createSection' , async(req,res) =>{
  try{
    const {act,section,violation_description,penalty_description,penalty_amount,penalty_point} = req.body;
    const sectiondata = await sections.create({
      act,
      section,
      violation_description,
      penalty_description,
      penalty_amount,
      penalty_point
    });
   return res.status(200).json({message:"Section data added successfully",sectiondata});
  } catch(error){
    console.error(error);
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.post('/createDocument' , async(req, res) =>{
  try{
    const { act , document_description, penalty_description, penalty_amount,penalty_point} = req.body;
    const documentdata = await documents.create({
      act,
      document_description,
      penalty_description,
      penalty_amount,
      penalty_point
    });
    return res.status(200).json({message:"Document data added successfully",documentdata});
  } catch(error){
    console.error(error);
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.get('/listSections/:act' , async (req,res)=>{
  try{
    const act = req.params.act;
    const sectiondata = await sections.findAll({where:{act},
    });
    const documentdata = await documents.findAll({where:{act},
    });
    return res.status(200).json({message:"List of sections",sectiondata,documentdata});
  } catch(error){
    console.error(error);
    return res.status(500).json({message:"Internal server error",error});
  }
 });
 
       /////////////////////// Department to Sector //////////////////////////
       
router.post('/addDeptSector',async(req,res)=>{
  try{
     const {dept_name,sector_name}= req.body;
     const deptSector = await deptsector.create({
      dept_name,
      sector_name
    });
     return res.status(200).json({message:"DeptSector data added successfully",deptSector});
    }
  catch(error){
    return res.status(500).json({message:"Internal server error",error});
  }
 });

router.get('/listDeptSector',async(req,res)=>{
  try{
      const data = await deptsector.findAll();
      return res.status(200).json({message:"List of deptsectors",data});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
 });

 router.put('/updateDeptSector/:id',async(req,res)=>{
  try{
      const id = req.params.id;
      const value = req.body;
      if(!id){
        return res.status(404).json({message:"id not found"});
      }
      const id_dept_sec = await deptsector.findOne({where:{id}});
      if(!id_dept_sec){
        return res.status(401).json({message:"id not existing"});
      }
      await deptsector.update(value,{where:{id}});
      return res.status(200).json({message:"DeptSector updated successfully"});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
});
router.delete('/deleteDeptSector/:id',async(req,res)=>{
  try{
      const id = req.params.id;
      if(!id){
        return res.status(404).json({message:"id not found"});
      }
      const valueid = await deptsector.findOne({where:{id}});
      if(!valueid){
        return res.status(401).json({message:"id not existing"});
      }
      await valueid.destroy();
      return res.status(200).json({message:"deleted successfully"});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
});

      //////////////////////// Act to Departments ///////////////////////
 router.post('/addActDept',async(req,res)=>{
  try{
    const {dept_name,act_name}=req.body;
    const data = await actdept.create({dept_name,act_name});
    return res.status(200).json({message:"Acts added successfully",data});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
 });

router.get('/listActDept',async(req,res)=>{
  try{
    const data = await actdept.findAll();
    return res.status(200).json({message:"data added successfully",data});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
 });

 router.put('/updateActDept/:id',async(req,res)=>{
  try{
      const id = req.params.id;
      const value = req.body;
      if(!id){
        return res.status(404).json({message:"id not found"});
      }
      const id_act_dept = await actdept.findOne({where:{id}});
      if(!id_act_dept){
        return res.status(401).json({message:"id not existing"});
      }
      await actdept.update(value,{where:{id}});
      return res.status(200).json({message:"updated successfully"});
    }
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    }
});
router.delete('/deleteActDept/:id',async(req,res)=>{
  try{
      const id = req.params.id;
      if(!id){
        return res.status(404).json({message:"id not found"});
      }
      const valueid = await actdept.findOne({where:{id}});
      if(!valueid){
        return res.status(401).json({message:"id not existing"});
      }
      await valueid.destroy();
      return res.status(200).json({message:"deleted successfully"});
     }
     catch(error){
      return res.status(500).json({message:"Internal server error",error});
     }
});

       /////////////////////// Create Roll ///////////////////////

router.post('/createRole', async(req,res) =>{
  try{
    const {role_name,access} = req.body;
    const roledata = await roles.create({
      role_name,
      access
    });
    return res.status(200).json({message:"Role created successfully" , roledata});
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error", error});
  }
 });

// router.post('/createEmployee' , upload.single('Image'), async(req,res) =>{
//   try{
//     const {name,role_name,mobile_number,aadhar,address} = req.body;
//     const imageFile = req.file;
//     const newEmployee = await employee.create({
//       name,
//       role_name,
//       mobile_number,
//       aadhar,
//       address
//     });

//     let Image = '';
//     if (imageFile){
//       const imagePath = `profile_images/${newEmployee.id}/${imageFile.originalname}`;
//       await storage.upload(imageFile.path,{
//         destination: imagePath,
//         metadata: {
//           contentType: imageFile.mimetype
//         }
//       });
//       Image = `gs://${storage.name}/${imagePath}`;
//     } 
//      await newEmployee.update({Image});
//      return res.status(200).json({message: 'Employee cretaed successfully'});
//     } catch(error) {
//       return res.status(500).json({message: "Internal server error: " + error.message});

//     }
//   });
 module.exports = router;

