const department = require('../model/department')
const businesstype = require('../model/businesstype')
const employees = require('../model/employees')
const roles = require('../model/role')
const laws = require('../model/law')
const Questions = require('../model/questions')
const User = require('../model/user')
const branchAdmin = require('../model/branchAdmin')
const documents = require('../model/document')


department.sync({alter:true})
.then(()=>{
  console.log('department table created');
})
.catch((err)=>{
  console.error('Error:',err);
});



businesstype.sync({alter:true})
.then(()=>{
  console.log('businesstype table created');
})
.catch((err)=>{
  console.error('Error:',err);
});


employees.sync({alter:true})
.then(()=>{
  console.log('employees table created');
})
.catch((err)=>{
  console.error('Error:',err);
});


roles.sync({alter:true})
.then(()=>{
  console.log('roles table created');
})
.catch((err)=>{
  console.error('Error:',err);
});



laws.sync({alter:true})
.then(()=>{
  console.log('laws table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

Questions.sync({alter:true})
.then(()=>{
  console.log('Questions table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

User.sync({alter:true})
.then(()=>{
  console.log('department table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

branchAdmin.sync({alter:true})
.then(()=>{
  console.log('department table created');
})
.catch((err)=>{
  console.error('Error:',err);
});

documents.sync({alter:true})
.then(()=>{
  console.log('department table created');
})
.catch((err)=>{
  console.error('Error:',err);
});