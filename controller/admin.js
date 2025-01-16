const express = require("express");
const router = express.Router();
const department = require("../model/department");
const businesstype = require("../model/businesstype");
const employees = require('../model/employees');
const roles = require("../model/role");
const laws = require("../model/law");
const Questions = require('../model/questions');
const { where } = require("sequelize");
const { sequelize  , Op , fn, col} = require("sequelize");
const branchAdmin = require("../model/branchAdmin");

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



///////////////////// Departments //////////////////////

router.post("/newDepartment", async (req, res) => {
  try {
    const { department_name, department_type, appropriate_govt} = req.body;
    if (!department_name || department_name.trim === "" || !department_type || department_type.trim === "" || !appropriate_govt || appropriate_govt.trim === "") {
      return res.status(400).json({ message: "Missing Field  values " });
    }
    const DepartmentName = await department.create({
      department_name,
      department_type,
      appropriate_govt,
      
    });
    return res
      .status(200)
      .json({ message: "Department added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get('/departments/:business_type' , async(req,res) =>{
  try{
    const {business_type} = req.params;
    const departmentlist = await businesstype.findAll({
      where: {business_type} 
    });
//console.log(departmentlist)
    const departmentNames = departmentlist.map(dept => dept.department_name);

    if(!departmentlist){
      return res.status(401).json({message:"departments not found"});
    }
    return res.status(200).json(departmentNames);
  } catch(error){
console.log(error)
    return res.status(500).json({message:"internal server error"});
  }
});

router.get("/listDepartment", async (req, res) => {
  try {
    const data = await department.findAll();
    return res.status(200).json({ message: "department list", data });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
});

router.put('/updateDepartment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {department_type,appropriate_govt} = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "id required" });
    }

    if(!department_type || department_type.trim === "" || !appropriate_govt || appropriate_govt.trim ===""){
      return res.status(400).json({message:"All fields are required"});
    }
    
    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    const new_data = await department.update(
      {
        department_type,
        appropriate_govt
      }, 
      {where:{ id } 
    });
    return res.status(200).json({ message: " department updated successfully" });
  } 
  catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteDepartment/:id", async (req, res) => {
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

router.get('/getDepartmentById/:id' , async(req,res) =>{
  try{
      const id = req.params.id;
      if(!id){
        return res.status(401).json({message:"id is required"});
      }
      const dept = await department.findOne({ where: { id } });
      return res.status(200).json(dept)
  } catch(error){
    console.log(error)
    return res.status(500).json({message:"internal server error"})
  }
});

/////////////////////// Business Type //////////////////////////

router.post("/addBusinessType", async (req, res) => {
  try {
    const { business_type, department_name } = req.body;
    if (
      !business_type ||
      business_type.trim === "" ||
      !department_name ||
      department_name.trim === ""
    ) {
      return res
        .status(400)
        .json({ message: "business_type  or Department Name is Required" });
    }
    const newdata = await businesstype.create({
      business_type,
      department_name,
    });
    return res
      .status(200)
      .json({ message: "Business type created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/listBusinessType", async (req, res) => {
  try {
    const data = await businesstype.findAll();
    return res.status(200).json({ message: "List of businesstype", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.put("/updateBusinessType/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { department_name } = req.body;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }

    if (
      !department_name ||
      department_name.trim === "" 
      
    ) {
      return res
        .status(400)
        .json({ message: " Department Name is Required" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "Business Type not existing" });
    }
    await businesstype.update(
      {
        department_name,
      },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ message: " updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/deleteBusinessType/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ message: "id not found" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if (!data) {
      return res.status(401).json({ message: "BusinessType not existing" });
    }
    await data.destroy();
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get('/getBusinessTypeById/:id',async(req, res) =>{
  try{
    const id = req.params.id;
    if(!id){
      return res.status(401).json({message:"id required"});
    }
    const data = await businesstype.findOne({where:{id}});
      return res.status(200).json({
     id:data.id,
     business_type:data.business_type,
     department_name:data.department_name
        })

    }
  
    catch(error){
      return res.status(500).json({message:"Internal server error",error});
    
  }
});


/////////////////////// Employee //////////////////////

router.post('/newEmployeeCategory' , async(req,res) =>{
  try{
    const { min, operator,max,emp_count_type, emp_category,department_name, law ,description ,section} = req.body;
    const newEmployee = await employees.create({
      min,
      operator,
      max,
      emp_count_type,
      emp_category,
      department_name,
      law,
      description,
      section
    });

    return res.status(200).json({ message: "Data inserted successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
});

router.get('/listEmployeeCategory', async(req,res) =>{
  try{
    const EmployeesCategory = await employees.findAll();
    return res.status(200).json({message:"employee category list " , EmployeesCategory});
  } catch(error){
    return res.status(500).json({message:"Internal server error", error});
  }
});

router.put('/updateEmployeeCategory/:id' , async(req,res) =>{
  try{
    const id = req.params.id;
    const data = req.body;
    if(!id){
      return res.status(400).json({message:"id required"});
    }
    if(!data){
      return res.status(400).json({message:"data required"});
    }
    const existingcategory = await employees.findOne({where:{id}});
    if(!existingcategory){
      return res. status(400).json({message:"data not found"});
    }
    const updatedEmployee = await employees.update(data,{where:{id}});
    return res.status(200).json({message:"employee category updated successfully"});
  } catch(error){
    return res.status(500).json({message:'Internal server error', error})
  }
});

router.delete('/deleteEmployeeCategory/:id', async(req, res)=>{
  try{
    const id = req.params.id;
    if(!id){
      return res.status(400).json({message:'id required'});
    }
    const existingcategory = await employees.findOne({where:{id}});
    if(!existingcategory){
      return res.status(400).json({message:"data not found"});
    }
     await existingcategory.destroy();
    return res.status(200).json({message:"employee category deleted"});
  } catch(error){
    console.log(error);
    return res.status(500).json({message:'Internal server error', error})
  }
});

router.get('/employeeCategoryById/:id',async(req,res) =>{
  try{
    const id = req.params.id;
    if(!id){
      return res.status(401).json({message:"id required"});
    }
    const employees = await employees.findAll({where:{id}});
    if(!employees){
      return res.status(401).json({message:"employee not found"});
    }
    return res.status(200).json({message:"emloyee details",employees});
   }
   catch(error){
    return res.status(500).json({message:"Internal server error"});
   }
});

//////////////////////law //////////////////////////////

router.post('/addLaw' , async(req,res) =>{
  try{
    const {department_name , law ,act_rule ,section ,penalty_amount , due_date, alert_date,gravity} = req.body;
    const newlaw = await laws.create({
      department_name , 
      law ,
      act_rule ,
      section ,
      penalty_amount , 
      due_date, 
      alert_date,
      gravity  
    });
    return res.status(200).json({message:"law created successfully"});

  } catch(error){
    return res.status(500).json({message:"internal server error"});
  }
});

router.get('/listlaws' , async(req,res) =>{
  try{
    const lawslist = await laws.findAll();
    return res.status(200).json({message:"laws list ", lawslist});
  } catch(error){
    return res.status(500).json({message:"internal server error"});
  }
});

router.put('/updateLaw/:id' , async(req,res) =>{
  try{
    const id = req.params.id;
    const newdata = req.body;
    if(!id){
      return res.status(400).json({message:"id is required"});
    }
    if(!newdata){
      return res.status(400).json({message:"data required"});
    }
    const existinglaw = await laws.findOne({where:{id}});
    if(!existinglaw){
      return res.status(400).json({message:"laws not found"});
    }
    await existinglaw.update(newdata);
    return res.status(200).json({message:"law deleted successfully"});
  } catch(error){
    return res.status(500).json({message:"internal server error", error})
  }
});

router.delete('/deleteLaw/:id' , async(req,res) =>{
  try{
    const id = req.params.id;
    if(!id){
      return res.status(400).json({message:"id is required"});
    }
    const existinglaw = await laws.findOne({where:{id}});
    if(!existinglaw){
      return res.status(400).json({message:"law is not found"});
    }
    await existinglaw.destroy();
    return res.status(200).json({message:"law deleted successfully"});
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"internal server error", error})
  }
});

///////////////////// Questions ////////////////////////

router.post('/addQuestions', async (req, res) => {
  try {
    const { section, questionsList  } = req.body;

    // Check if the required fields are present
    if (!section || !questionsList || !Array.isArray(questionsList) ) {
      return res
        .status(400)
        .json({ message: "Section and a valid questionsList array are required" });
    }

    // Prepare the data for bulkCreate
    const newQuestions = await Questions.bulkCreate(
      questionsList.map((q) => ({
        section,
        questions: q.questions,
        gravity: q.gravity,
      }))
    );

    return res.status(200).json({ message: "Questions added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get('/listQuestions' , async (req,res) =>{
  try{
    const questions = await Questions.findAll();
    return res.status(200).json({ message: "Questions list", questions });
  } catch(error){
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// router.get('/evaluationQuestions', async (req, res) => { 

//   try {
//     const { branch_id } = req.query; 
//     if (!branch_id) {
//       return res.status(400).json({ message: 'Invalid or undefined "businee_type" parameter' });
//     }
//     const dept = await branchAdmin.findAll(
//       { where:
//          { branch_id} ,
//          attributes:
//          [ 'business_type' ,
//           'no_female',
//           'total_employees',
//           'no_contract' ,
//           'no_migrant'
//         ]});
   
//         const BusinessType = [...new Set(dept.map(item => item.business_type))];
//         const Department = await businesstype.findAll({where:{business_type:BusinessType},attributes:['department_name']})
          

//         return res.status(200).json(Department);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// });




///////////////////// Create Roll ///////////////////////



// // router.get('/evaluationQuestions', async (req, res) => { 
//   try {
//     const { branch_id, total_employees } = req.query;

//     // Validate inputs
//     if (!branch_id) {
//       return res.status(400).json({ message: 'Invalid or undefined "branch_id" parameter' });
//     }

//     if (!total_employees) {
//       return res.status(400).json({ message: 'Invalid or undefined "total_employees" parameter' });
//     }

//     // Fetch branch data
//     const dept = await branchAdmin.findAll({
//       where: { branch_id },
//       attributes: [
//         'business_type',
//         'no_female',
//         'total_employees',
//         'no_contract',
//         'no_migrant'
//       ]
//     });

//     // Extract unique business types
//     const BusinessType = [...new Set(dept.map(item => item.business_type))];

//     // Fetch department names based on business types
//     const Department = await businesstype.findAll({
//       where: { business_type: BusinessType },
//       attributes: ['department_name', 'emp_range']
//     });

//     // Filter departments based on total_employees matching emp_range
//     const filteredDepartments = Department.filter(dept => {
//       const [lower, upper] = dept.emp_range.split('<');
//       const lowerBound = parseInt(lower.replace('<=', '').trim());
//       const upperBound = parseInt(upper.trim());
//       const totalEmployees = parseInt(total_employees);

//       return totalEmployees >= lowerBound && totalEmployees < upperBound;
//     });

//     return res.status(200).json(filteredDepartments);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// });

// router.get('/evaluationQuestions', async (req, res) => {
//   try {
//     const { branch_id, total_employees, department_name,emp_category } = req.query;
//     if (!total_employees || !branch_id) {
//       return res.status(401).json({ message: "Total employee count and branch id required" });
//     }

//     const totalCount = parseInt(total_employees, 10);

//     // Fetch all employee records from the database
//     const allEmployees = await employees.findAll({where:{department_name, emp_category}});

//     // Filter the records based on the employee range
//     const matchedRecord = allEmployees.find((employees) => {
//       const [lowerBound, upperBound] = employees.emp_range
//         .split(/<=|<|=/)
//         .map((value) => (value.trim() ? parseInt(value, 10) : null));

//       return totalCount >= lowerBound && totalCount <= upperBound;
//     });

//     if (!matchedRecord) {
//       return res.status(400).json({
//         message: "No employee count range found for this total employee count",
//       });
//     }
//     //const uniqueSessionNos = [...new Set(matchedRecord.map(item => item.section))];
//     //console.log(matchedRecord);
//     return res.status(200).json({
//       message: "Employee record corresponding to employee range:",
//       matchedRecord,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error", error });
//   }
// });



///////////////////////////// Role Based ////////////////////////////////////////


router.get('/evaluationQuestions', async (req, res) => {
  try {
    const { branch_id, total_employees, department_name, emp_category } = req.query;
console.log(".....",branch_id, total_employees, department_name, emp_category );
    // Validate required query parameters
    if (!total_employees || !branch_id) {
      return res.status(401).json({ message: "Total employee count and branch id required" });
    }

    const totalCount = parseInt(total_employees, 10);

    // Step 1: Fetch and filter employee records by department and category
    const allEmployees = await employees.findAll({
      where: {
        department_name,
        [Op.and]: [
          fn('JSON_CONTAINS', col('emp_category'), JSON.stringify([emp_category]))
        ],
      },
    });
    
    
    console.log("employee...", allEmployees.dataValues)

    if (!allEmployees.length) {
      return res.status(404).json({ message: "No employees found for the given department and category" });
    }

    // Step 2: Filter the records based on the employee range
    const matchedRecord = allEmployees.find((employees) => {
      const [lowerBound, upperBound] = employees.emp_range
        .split(/<=|<|=/)
        .map((value) => (value.trim() ? parseInt(value, 10) : null));

      return totalCount >= lowerBound && totalCount <= upperBound;
    });
    console.log("matched......",matchedRecord.dataValues);

    if (!matchedRecord) {
      return res.status(400).json({
        message: "No employee count range found for this total employee count",
      });
    }

    // Step 3: Extract unique session(s) from the matched record
    const section = matchedRecord.dataValues.section
   // const uniqueSessions = [...new Set(matchedRecord.section)];
      console.log(section)
    if (!section.length) {
      return res.status(404).json({ message: "No sessions found in the matched record" });
    }

    // Step 4: Fetch questions from the database using the unique session(s)
    const questions = await Questions.findAll({
      where: { section}
    });

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for the matched section(s)" });
    }

    // Return the questions
    return res.status(200).json({
      message: "Questions fetched successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

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









module.exports = router;
