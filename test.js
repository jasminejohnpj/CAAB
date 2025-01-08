let emp_count = 10;
let female_count = 4;
let conditions = [
    "<=5",
    "6<=10",
    ">=10",
    ">=10",
    "10<=20",
    ">=20",
    "<=1",
    ">=20",
    "<=1",
    "1<=9",
    ">=10",
    ">=5",
    ">=20"

]

conditions.forEach(i => {
    console.log(i);
})
let query = `select emp_range , department_name, sections from caab.employee where `;
