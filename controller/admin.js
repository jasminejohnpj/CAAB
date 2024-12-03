const express = require("express");
const router = express.Router();
const sector = require("../model/sector");
const department = require("../model/department");
const deptsector = require("../model/deptsector");
const roles = require("../model/role");
const acts = require("../model/act");
const category= require('../model/category');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

//const upload = multer({dest: 'uploads/'})
//const storage = admin.storage().bucket();
const { where } = require("sequelize");
const { sequelize } = require("sequelize");
const { Op } = require("sequelize");
const sections = require("../model/sections");

router.post("/query", async (req, res) => {
  try {
    console.log(req.body);
    const results = await sequelize.query(`${req.body.query}`);
    if (results) {
      return res.json({ response: results });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//////////////////////  Sectors  ///////////////////////
router.post("/addSector", async (req, res) => {
  try {
    const { sector_name } = req.body;
    if (!sector_name || sector_name.trim === "") {
      return res.status(400).json({ message: "sector name is required" });
    }
    await sector.create({ sector_name });
    return res.status(200).json({ message: "sector name added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/listSector", async (req, res) => {
  try {
    const data = await sector.findAll();
    return res.status(200).json({ message: "List of sectors", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.put("/updateSector/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { sector_name } = req.body;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    if (!sector_name || sector_name.trim() === "") {
      return res.status(400).json({ message: "sector name required" });
    }
    const idsector = await sector.findOne({ where: { id } });
    if (!idsector) {
      return res.status(401).json({ message: "sector id not existing" });
    }
    const new_data = await sector.update(sector_name, { where: { id } });
    return res
      .status(200)
      .json({ message: " sector name updated successfully", new_data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteSector/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(500).json({ message: "id not found" });
    }
    const data = await sector.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "sector not existing" });
    }
    await data.destroy();
    return res.status(200).json({ message: "sector deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////// Departments //////////////////////
router.post("/addDept", async (req, res) => {
  try {
    const { dept_name  } = req.body;
    if (!dept_name || dept_name.trim === "" ) {
      return res.status(400).json({ message: "Missing Field  values " });
    }
    const DepartmentName = await department.create({
      dept_name,
      
    });
    return res
      .status(200)
      .json({ message: "Department added successfully", DepartmentName });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/listDept", async (req, res) => {
  try {
    const data = await department.findAll();
    return res.status(200).json({ message: "department list", data });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
});

router.put("/updateDept/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { dept_name  } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "id required" });
    }

    if (!dept_name || dept_name.trim === "" ) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    const new_data = await department.update(
      {
        dept_name,
        
      },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ message: " department updated successfully", new_data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteDept/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id required" });
    }
    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    const department_details = await department.findOne({ where: { id } });
    await department_details.destroy();
    return res.status(200).json({ message: "department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/////////////////////// Department to Sector //////////////////////////
router.post("/addDeptSector", async (req, res) => {
  try {
    const { dept_name, sector_id } = req.body;
    if (
      !dept_name ||
      dept_name.trim === "" ||
      !sector_id ||
      sector_id.trim === ""
    ) {
      console.log(dept_name);
      return res
        .status(400)
        .json({ message: "Sector id or Department Name is Required" });
    }
    const deptSector = await deptsector.create({
      dept_name,
      sector_id,
    });
    return res
      .status(200)
      .json({ message: "Department Sector data added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/listDeptSector", async (req, res) => {
  try {
    const data = await deptsector.findAll();
    return res.status(200).json({ message: "List of deptsectors", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.put("/updateDeptSector/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { dept_name, sector_id } = req.body;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }

    if (
      !dept_name ||
      dept_name.trim === "" ||
      !sector_id ||
      sector_id.trim === ""
    ) {
      return res
        .status(400)
        .json({ message: "Sector Name or Department Name is Required" });
    }
    const data = await deptsector.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "id not existing" });
    }
    await deptsector.update(
      {
        dept_name,
        sector_id,
      },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ message: "Department Sector updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteDeptSector/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    const data = await deptsector.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "id not existing" });
    }
    await data.destroy();
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

/////////////////////// Create Roll ///////////////////////
router.post("/createRole", async (req, res) => {
  try {
    const { role_name, access, allowed_routes } = req.body;
    const roledata = await roles.create({
      role_name,
      access,
      allowed_routes,
    });
    console.log("START", roledata.dataValues, "END");
    return res
      .status(200)
      .json({ message: "Role created successfully", roledata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/listRoles", async (req, res) => {
  try {
    const data = await roles.findAll();
    return res.status(200).json({ message: "List of roles", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/getRoleById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(401).json({ message: "role not existing" });
    }
    return res.status(200).json({ message: "role listed:", role });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.put("/updateRole/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id required" });
    }
    const { role_name, access, allowedRoutes } = req.body;
    if (
      !role_name ||
      !access ||
      !allowedRoutes ||
      role_name.trim() === "" ||
      access.length === 0 ||
      allowedRoutes.length === 0
    ) {
      return res
        .status(401)
        .json({ message: "role name, access, allowedRoutes are required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(401).json({ message: "role does not exist" });
    }
    await roles.update({ role_name, access, allowedRoutes }, { where: { id } });
    return res.status(200).json({ message: "role updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteRoleById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id is required" });
    }
    const role = await roles.findOne({ where: { id } });
    if (!role) {
      return res.status(401).json({ message: "Role does not exists" });
    }
    await role.destroy();
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

//////////////////////////// ACT //////////////////////////

router.post('/addAct' , async (req, res) =>{
  try{
    const { sector_id, dept_name , act_name } = req.body;
    if(!sector_id || sector_id.trim === '' ||!dept_name || dept_name.trim === '' ||!act_name || act_name.trim === '' ){
      return res.status(400).json({message: 'Fields are required'});
    }
    const act = await acts.create({sector_id, dept_name, act_name});
    return res.status(200).json({message: 'Act added successfully'});
  } 
   catch(error){
    return res.status(500).json({message: 'Internal server error', error});
   }
});

router.get('/listActs' , async(req, res) =>{
  try{
    const Act = await acts.findAll();
    return res.status(200).json({message:'Act list ', Act});
  } catch(error){
    return res.status(500).json({message: 'Internal server error', error});
  }
});


////////////////// category ////////////////////////////

router.post('/addCategory' , async (req,res) =>{
  try{
    const category_name = req.body.category_name;
    if(!category_name){
      return res.status(400).json({message: 'Category name is required'});
    }
    const Category = await category.create({
      category_name
    });
    return res.status(200).json({message: 'Category added successfully'});
  } catch(error){
    console.log(error);
    return res.status(500).json({message: 'Internal server error', error});
  }
});

router.get('/listCategory' , async (req, res) =>{
  try{
    const Category = await category.findAll();
    return res.status(200).json({message:'Category list ', Category});
  } catch(error){
    return res.status(500).json({message: 'Internal server error', error});
  }
});


///////////////////////// Sections ////////////////////////////////////

router.post('/addSections' , async (req,res) =>{
  try{
    const { sector_id,dept_name,act_id, section_no,description,document,penalty_point,penalty_amount,penalty_descriptions,category } = req.body;
    const Sections = await sections.bulkCreate({ 
      sector_id,
      dept_name,
      act_id, 
      section_no,
      description,
      document,
      penalty_point,
      penalty_amount,
      penalty_descriptions,
      category 
    });
    return res.status(200).json({message: 'Section added successfully'});
  } catch(error){
    console.log(error);
    return res.status(500).json({message: 'Internal server error', error});
  }
});



module.exports = router;
