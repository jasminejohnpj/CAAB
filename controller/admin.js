const express = require("express");
const router = express.Router();
const department = require("../model/department");
const businesstype = require("../model/businesstype");
const roles = require("../model/role");
const laws = require("../model/law");
const Questions = require('../model/questions');
const { where } = require("sequelize");
const { Sequelize, Op, fn, col } = require("sequelize");
const branchAdmin = require("../model/branchAdmin");
const db = require("../model/db");
const User = require("../model/user");
const category = require("../model/category");

const questionResponse = require("../model/response");
const caabAdmin = require('../model/caabAdmin')


router.post("/query", async (req, res) => {
  try {
    console.log(req.body, req.body['query']);

    const sql = req.body["query"]
    const results = await db.query(`${sql}`);
    if (results) {
      return res.json({ response: results });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message });
  }
});

///////////////////// Departments //////////////////////

router.post("/newDepartment", async (req, res) => {
  try {
    const { department_name, department_type, appropriate_govt } = req.body;
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

router.get('/departments', async (req, res) => {
  try {
    const departmentlist = await department.findAll({
      attributes: ['department_name'],
    });
    const departmentNames = departmentlist.map(dept => dept.department_name);

    if (!departmentlist) {
      return res.status(204).json({ message: "departments not found" });
    }
    return res.status(200).json(departmentNames);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

router.get('/getDepartmentsByBusinessType/:business_type', async (req, res) => {
  try {
    const businessType = req.params.business_type;
    if (!businessType) {
      return res.status(401).json({ message: "business type required" });
    }
    const departments = await businesstype.findOne({ where: { business_type: businessType }, attributes: ['department_name'] });
    if (!departments) {
      return res.status(204).json({ message: "departments does not exist under the business type" });
    }
    const departmentNames = departments.department_name;
    return res.status(200).json(departmentNames);
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// router.get("/listDepartment", async (req, res) => {
//   try {
//     const data = await department.findAll();
//     return res.status(200).json({ message: "department list", data });
//   } catch (error) {
//     return res.status(500).json({ message: "internal server error", error });
//   }
// });

router.get("/listDepartment", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 if not provided

    // Validate page and pageSize
    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    // Fetch total count of departments
    const totalCount = await department.count();

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Handle case where requested page exceeds total pages
    if (page > totalPages) {
      return res.status(200).json({
        message: "No departments found for this page",
        departments: [],
        totalPages,
        totalCount,
      });
    }

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Fetch paginated departments
    const allDepartments = await department.findAll({
      order: [["id", "DESC"]], // Sort by ID in descending order
      limit: pageSize,
      offset: offset,
    });

    // Return response with all model fields
    return res.status(200).json({
      message: "Department list",
      departments: allDepartments,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching department list:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.put('/updateDepartment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { department_type, appropriate_govt } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "id required" });
    }

    if (!department_type || department_type.trim === "" || !appropriate_govt || appropriate_govt.trim === "") {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dept = await department.findOne({ where: { id } });
    if (!dept) {
      return res.status(204).json({ message: "Department not found" });
    }
    const new_data = await department.update(
      {
        department_type,
        appropriate_govt
      },
      {
        where: { id }
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

router.get('/getDepartmentById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "id is required" });
    }
    const dept = await department.findOne({ where: { id } });
    return res.status(200).json(dept)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "internal server error" })
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
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await businesstype.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No businessType found for this page",
        businessType: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;
    const allBusinessType = await businesstype.findAll({
      order: [["id", "DESC"]], 
      limit: pageSize,
      offset: offset,
    });
    return res.status(200).json({ message: "List of businesstype", 
      businessType:allBusinessType,
       totalPages,
      totalCount,
     });
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
      return res.status(204).json({ message: "Business Type not existing" });
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

router.get('/getBusinessTypeById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "id required" });
    }
    const data = await businesstype.findOne({ where: { id } });
    if(!data){
      return res.status(403).json({message:"id not found"});
    }
    return res.status(200).json({
      id: data.id,
      business_type: data.business_type,
      department_name: data.department_name
    })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error", error });

  }
});


//////////////////////law //////////////////////////////

router.post('/addLaw', async (req, res) => {
  try {
    const { department_name, law, act_rule, section, penalty_amount, due_date, alert_date, gravity } = req.body;
    const newlaw = await laws.create({
      department_name,
      law,
      act_rule,
      section,
      penalty_amount,
      due_date,
      alert_date,
      gravity
    });
    return res.status(200).json({ message: "law created successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

router.get('/listlaws', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await laws.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No laws found for this page",
        law: [],
        totalPages,
        totalCount,
      });
    }
    const offset = (page - 1) * pageSize;

    const allLaws = await laws.findAll({
      order: [["id", "DESC"]], 
      offset: offset,
    });
    return res.status(200).json({ message: "laws list ", 
      law:allLaws,
      totalPages,
      totalCount,
     });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

router.put('/updateLaw/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newdata = req.body;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    if (!newdata) {
      return res.status(400).json({ message: "data required" });
    }
    const existinglaw = await laws.findOne({ where: { id } });
    if (!existinglaw) {
      return res.status(204).json({ message: "laws not found" });
    }
    await existinglaw.update(newdata);
    return res.status(200).json({ message: "law updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error })
  }
});

router.delete('/deleteLaw/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const existinglaw = await laws.findOne({ where: { id } });
    if (!existinglaw) {
      return res.status(204).json({ message: "law is not found" });
    }
    await existinglaw.destroy();
    return res.status(200).json({ message: "law deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error", error })
  }
});

///////////////////// Questions ////////////////////////

router.post('/addQuestions', async (req, res) => {
  try {
    const { section, questionsList } = req.body;

    // Check if the required fields are present
    if (!section || !questionsList || !Array.isArray(questionsList)) {
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

router.get('/listQuestions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    if (page <= 0 || pageSize <= 0) {
      return res
        .status(400)
        .json({ message: "Page and page size must be positive integers" });
    }

    const totalCount = await Questions.count();

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No businessType found for this page",
        questions: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;
    const allQuestions = await Questions.findAll({
      order: [["id", "DESC"]], 
      limit: pageSize,
      offset: offset,
    });
    return res.status(200).json({ message: "Questions list", 
      questions:allQuestions,
      totalPages,
      totalCount,
     });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete('/removeQuestions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const existingQuestions = await Questions.findOne({ where: { id } });
    if (!existingQuestions) {
      return res.status(204).json({ message: "question is not found" });
    }
    await existingQuestions.destroy();
    return res.status(200).json({ message: "question deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error", error })
  }
});

router.get('/evaluationQuestions', async (req, res) => {
  try {
    const { branch_id } = req.query;
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Page and page size must be positive integers" });
    }

    if (!branch_id) {
      return res.status(400).json({ message: 'Invalid or undefined "branch_id" parameter' });
    }

    // Fetch business type for the given branch_id
    const businessType = await branchAdmin.findAll({
      where: { branch_id },
      attributes: ['business_type']
    });

    if (!businessType || businessType.length === 0) {
      return res.status(404).json({ message: 'No business type found for the given branch_id' });
    }

    const { business_type } = businessType[0].dataValues;

    // Fetch departments related to the business type
    const departments = await businesstype.findAll({
      where: { business_type },
      attributes: ['department_name']
    });

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found for the given business type' });
    }

    const departmentNames = departments.map(dept => dept.department_name);

    // Fetch related laws for the department names
    const sections = await laws.findAll({
      where: {
        department_name: {
          [Op.in]: departmentNames,
        }
      },
      attributes: ['section'] 
    });

    if (!sections || sections.length === 0) {
      return res.status(404).json({ message: 'No related laws found for the given departments' });
    }

    const section = sections.map(law => law.section);

    // Pagination setup
    const offset = (page - 1) * pageSize;

    // Fetch paginated questions
    const allQuestions = await Questions.findAll({
      where: { section },
      order: [["id", "DESC"]], 
      limit: pageSize,
      offset: offset,
    });

    const totalCount = await Questions.count({ where: { section } }); // Correcting count usage
    const totalPages = Math.ceil(totalCount / pageSize);

    if (page > totalPages) {
      return res.status(200).json({
        message: "No questions found for this page",
        questions: [],
        totalPages,
        totalCount,
      });
    }

    // Return the list of questions and pagination info
    return res.status(200).json({
      message: "List of questions",
      questions: allQuestions,  // Changed from 'businessType' to 'questions'
      totalPages,
      totalCount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
});




/////////////////// Role //////////////////

router.post("/createRole", async (req, res) => {
  try {
    const { role_name, access, allowed_routes } = req.body;
    const roledata = await roles.create({
      role_name,
      access,
      allowed_routes,
    });
    //console.log("START", roledata.dataValues, "END");
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
      return res.status(204).json({ message: "role not existing" });
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
      return res.status(204).json({ message: "role does not exist" });
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
      return res.status(204).json({ message: "Role does not exists" });
    }
    await role.destroy();
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

//////////////// caab admin //////////////////

router.get('/listSections', async (req, res) => {
  try {
    const list = await laws.findAll({ attributes:['section']});

    if (!list) {
      return res.status(204).json({ message: "No sections found." });
    }

    return res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/listCompanies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 

    if (page <= 0 || pageSize <= 0) {
      return res.status(400).json({ message: "Page and page size must be positive integers" });
    }

    // Fetch the total count of companies
    const totalCount = await User.count(); // Assuming User is the model for companies, adjust if necessary

    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      return res.status(200).json({
        message: "No companies found for this page",
        companies: [],
        totalPages,
        totalCount,
      });
    }

    const offset = (page - 1) * pageSize;

    // Fetch the paginated list of companies
    const companyList = await User.findAll({
      order: [["caab_id", "DESC"]],
      offset: offset,
      limit: pageSize, // Added limit to restrict the number of results
    });

    // Check if the companyList is empty
    if (!companyList || companyList.length === 0) {
      return res.status(204).json({ message: "Company list is empty" });
    }

    // Return the list of companies along with pagination info
    return res.status(200).json({
      message: "List of companies",
      companies: companyList,
      totalCount,
      totalPages,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.post('/grading', async (req, res) => {
  try {
    const { branch_id } = req.body;
    if (!branch_id) {
      return res.status(400).json({ message: "id not found" });
    }

    const branchResponses = await questionResponse.findAll({ where: { branch_id } });

    if (!branchResponses || branchResponses.length === 0) {
      return res.status(404).json({ message: "no responses found" });
    }

    // Filter out "Not Applicable" responses
    const validResponses = branchResponses.filter(response => {
      return response.response?.trim().toLowerCase() !== "not applicable";
    });

    // Initialize gravity count objects
    let allGravityCounts = { high: 0, medium: 0, low: 0 };
    let yesGravityCounts = { high: 0, medium: 0, low: 0 };

    // Process valid responses
    validResponses.forEach(response => {
      let normalizedResponse = response.response?.trim().toLowerCase();
      let normalizedGravity = response.gravity?.trim().toLowerCase();

      // Count gravity levels across all valid responses (Yes + No)
      if (normalizedGravity === "high") allGravityCounts.high++;
      else if (normalizedGravity === "medium") allGravityCounts.medium++;
      else if (normalizedGravity === "low") allGravityCounts.low++;

      if (normalizedResponse === "yes") {
        // Count gravity levels within "Yes" responses
        if (normalizedGravity === "high") yesGravityCounts.high++;
        else if (normalizedGravity === "medium") yesGravityCounts.medium++;
        else if (normalizedGravity === "low") yesGravityCounts.low++;
      }
    });

    // Calculate weighted scores
    const validHigh = allGravityCounts.high * 10;
    const validMedium = allGravityCounts.medium * 5;
    const validLow = allGravityCounts.low * 3;
    const validTotal = validHigh + validMedium + validLow;

    const yesHigh = yesGravityCounts.high * 10;
    const yesMedium = yesGravityCounts.medium * 10;
    const yesLow = yesGravityCounts.low * 10;
    const yesTotal = yesHigh + yesMedium + yesLow;

    // Calculate percentage
    const gravityPercentage = validTotal > 0 ? (yesTotal / validTotal) * 100 : 0;

    const Report = validResponses
  .filter(response => response.response?.trim().toLowerCase() === "no")
  .map(response => ({
    section: response.section,
    questions: response.questions
  }));

    return res.status(200).json({
      gravityPercentage,
      Report
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;




