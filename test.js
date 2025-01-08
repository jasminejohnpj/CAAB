let data = [
    {
        "min": 10,
        "operator": "<=",
        "max": 20,
        "emp_count_type": "total_employees",
        "emp_category": ["normal", "migrant"],
        "section": "section 22"
    },
    {
        "min": 20,
        "operator": ">=",
        "max": 50,
        "emp_count_type": "total_employees",
        "emp_category": ["normal", "migrant"],
        "section": "section 26"
    },
    {
        "min": 1,
        "operator": "<=",
        "max": 9,
        "emp_count_type": "no_female",
        "emp_category": ["normal", "migrant"],
        "section": "section 16"
    },
    {
        "min": 10,
        "operator": "<=",
        "max": 59,
        "emp_count_type": "no_female",
        "emp_category": ["normal", "migrant"],
        "section": "section 13"
    }   
];

// Sample employee count for testing
let employeeCount = 15; // Change this value to test different scenarios

data.forEach(condition => {
    let { min, operator, max } = condition;

    let isValid = false;

    switch (operator) {
        case "<=":
            isValid = employeeCount <= max && employeeCount >= min;
            break;
        case ">=":
            isValid = employeeCount >= min && employeeCount <= max;
            break;
        case "<":
            isValid = employeeCount < max && employeeCount >= min;
            break;
        case ">":
            isValid = employeeCount > min && employeeCount <= max;
            break;
        case "=":
            isValid = employeeCount === min || employeeCount === max;
            break;
    }

    if (isValid) {
        console.log(`Employee count ${employeeCount} satisfies the condition in ${condition.section}`);
    } else {
        console.log(`Employee count ${employeeCount} does not satisfy the condition in ${condition.section}`);
    }
});
