const employees = [
    { id: 1, name: 'moe'},
    { id: 2, name: 'larry', managerId: 1},
    { id: 4, name: 'shep', managerId: 2},
    { id: 3, name: 'curly', managerId: 1},
    { id: 5, name: 'groucho', managerId: 3},
    { id: 6, name: 'harpo', managerId: 5},
    { id: 8, name: 'shep Jr.', managerId: 4},
    { id: 99, name: 'lucy', managerId: 1}
  ];
  
  const spacer = (text)=> {
    if(!text){
      return console.log('');
    }
    const stars = new Array(5).fill('*').join('');
    console.log(`${stars} ${text} ${stars}`);
  }
  
  spacer('findEmployeeByName Moe')
  // given a name and array of employees, return employee
  const findEmployeeByName = (name, employeesArr) => {
    const returnedArr = employeesArr.filter(employee => employee.name === name);
    return returnedArr[0];
  }
  console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
  spacer('')
  
  spacer('findManagerFor Shep')
  //given an employee and a list of employees, return the employee who is the manager
  const findManagerFor = (employeeObj, employeesArr) => {
    const returnedArr = employeesArr.filter(employee => employee.id === employeeObj.managerId);
    return returnedArr[0];
  }
  console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
  spacer('')
  
  spacer('findCoworkersFor Larry')
  
  //given an employee and a list of employees, return the employees who report to the same manager
  const findCoworkersFor = (employeeObj, employeesArr) => {
    const returnedArr = employeesArr.filter(employee => employee.managerId === employeeObj.managerId &&
    employee.id !== employeeObj.id
    );
    return returnedArr;
  }
  console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
  [ { id: 3, name: 'curly', managerId: 1 },
    { id: 99, name: 'lucy', managerId: 1 } ]
  */
  spacer('');
  
  spacer('findManagementChain for moe')
  //given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 
  const findManagementChainForEmployee = (employeeObj, employeesArr, managers = []) => {
    if (!employeeObj.managerId) {
      return managers;
    } else {
      let managerObj = findManagerFor(employeeObj, employeesArr);
      managers.unshift(managerObj);
      return findManagementChainForEmployee(managerObj, employeesArr, managers);
    }
  }
  console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
  spacer('');
  
  spacer('findManagementChain for shep Jr.')
  console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
  [ { id: 1, name: 'moe' },
    { id: 2, name: 'larry', managerId: 1 },
    { id: 4, name: 'shep', managerId: 2 }]
  */
  spacer('');
  
  
  spacer('generateManagementTree')
  //given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them. 
const generateManagementTree = (employeesArr) => {
  let treeObj = {};
  //find root object
  employeesArr.forEach(employeeObj => {
    if (!employeeObj.managerId) {
      treeObj.id = employeeObj.id;
      treeObj.name = employeeObj.name;
      treeObj.reports = [];
    }
  })

  const isManager = (employeeID) => {
    let managerIdArr = [];
    employeesArr.forEach(employeeObj => {
      if (employeeObj.managerId) {
        managerIdArr.push(employeeObj.managerId);
      }
    })
    if (managerIdArr.includes(employeeID)) {
      return true;
    }
    return false;
  }
  
  const helper = (employeesArr, managerObj) => {
    employeesArr.forEach(employeeObj => {
      if (!isManager(managerObj.id)) {
        return treeObj;
      } else if (managerObj.id === employeeObj.managerId) {
        employeeObj.reports = [];
        managerObj.reports.push(employeeObj);
        helper(employeesArr, employeeObj);
      }
    })
    return treeObj;
  }
  return helper(employeesArr, treeObj);
}
   
  console.log(JSON.stringify(generateManagementTree(employees), null, 2));
  /*
  {
    "id": 1,
    "name": "moe",
    "reports": [
      {
        "id": 2,
        "name": "larry",
        "managerId": 1,
        "reports": [
          {
            "id": 4,
            "name": "shep",
            "managerId": 2,
            "reports": [
              {
                "id": 8,
                "name": "shep Jr.",
                "managerId": 4,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "curly",
        "managerId": 1,
        "reports": [
          {
            "id": 5,
            "name": "groucho",
            "managerId": 3,
            "reports": [
              {
                "id": 6,
                "name": "harpo",
                "managerId": 5,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 99,
        "name": "lucy",
        "managerId": 1,
        "reports": []
      }
    ]
  }
  */
  spacer('');
  
  spacer('displayManagementTree')
  //given a tree of employees, generate a display which displays the hierarchy
  /* I got the result like this but can't figure out how to add "-" 
moe
larry
shep
shep Jr.
curly
groucho
harpo
lucy
*/
const displayManagementTree = (treeObj) => {
  let returnedString = "";

  const helper = (employeeObj) => {      
    if (employeeObj.reports.length !== 0) {
      returnedString += employeeObj.name + "\n";
      employeeObj.reports.forEach(subObj => {
        //returnedString = helper(subObj);
        return helper(subObj);
      });
    } else {
      returnedString += employeeObj.name + "\n";        
    }  
    return returnedString; 
  } 
  return helper(treeObj); 
}
  
  displayManagementTree(generateManagementTree(employees));/*
  moe
  -larry
  --shep
  ---shep Jr.
  -curly
  --groucho
  ---harpo
  -lucy
  */