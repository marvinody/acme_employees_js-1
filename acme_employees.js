const employees = [
  { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 },
  { id: 3, name: 'curly', managerId: 1 },
  { id: 5, name: 'groucho', managerId: 3 },
  { id: 6, name: 'harpo', managerId: 5 },
  { id: 8, name: 'shep Jr.', managerId: 4 },
  { id: 99, name: 'lucy', managerId: 1 }
]

const spacer = (text) => {
  if (!text) {
    return console.log('')
  }
  const stars = new Array(5).fill('*').join('')
  console.log(`${stars} ${text} ${stars}`)
}

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
// great variable names
const findEmployeeByName = (name, employeesArr) => {
  const returnedArr = employeesArr.filter(employee => employee.name === name)
  // so you use filter to grab an array, but then you get only the first element and don't care about the rest
  // what if I told you there was an array method to get ONLY the first element using a "filter-like" syntax?
  // mind-blown
  // take a look at the .find array method
  return returnedArr[0]
}
console.log(findEmployeeByName('moe', employees))//{ id: 1, name: 'moe' }
spacer('')

spacer('findManagerFor Shep')
//given an employee and a list of employees, return the employee who is the manager
// good variable names
const findManagerFor = (employeeObj, employeesArr) => {
  const returnedArr = employeesArr.filter(employee => employee.id === employeeObj.managerId)
  return returnedArr[0] // same thing as above
}
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees))//{ id: 4, name: 'shep', managerId: 2 }
spacer('')

spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager
const findCoworkersFor = (employeeObj, employeesArr) => {
  // what is returnedArr? what does it contain? is it a returnedArr of bananas?
  const returnedArr = employeesArr.filter(employee => employee.managerId === employeeObj.managerId &&
    employee.id !== employeeObj.id)
  return returnedArr
}
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees))/*
  [ { id: 3, name: 'curly', managerId: 1 },
    { id: 99, name: 'lucy', managerId: 1 } ]
  */
spacer('')

spacer('findManagementChain for moe')
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager
// good use of default args for recursion!
const findManagementChainForEmployee = (employeeObj, employeesArr, managers = []) => {
  if (!employeeObj.managerId) {
    return managers
  } else {
    let managerObj = findManagerFor(employeeObj, employeesArr)
    managers.unshift(managerObj)
    return findManagementChainForEmployee(managerObj, employeesArr, managers)
  }
}
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees))//[  ]
spacer('')

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees))/*
  [ { id: 1, name: 'moe' },
    { id: 2, name: 'larry', managerId: 1 },
    { id: 4, name: 'shep', managerId: 2 }]
  */
spacer('')


spacer('generateManagementTree')
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
const generateManagementTree = (employeesArr) => {
  let treeObj = {}
  //find root object
  employeesArr.forEach(employeeObj => {
    if (!employeeObj.managerId) {
      // what if the employee obj has 300,000,000 keys?
      // would you type out each one?
      // there's a syntax we can use to 'copy' an object shallowly
      // take a look at 'mdn spread operator' and try rewriting this with that if you have a chance
      treeObj.id = employeeObj.id
      treeObj.name = employeeObj.name
      treeObj.reports = []
    }
  })

  // I like that you make a function to help you later
  // good use of scope and function naming
  const isManager = (employeeID) => {
    let managerIdArr = []
    // but everytime you call this function, you have to 'rebuild' the managerIdArr which might take
    // a long time. imagine if you had a bunch of employees
    // would it be possible to build the managerArr once and refer to it? we'll revisit this topic much later in the course
    employeesArr.forEach(employeeObj => {
      if (employeeObj.managerId) {
        managerIdArr.push(employeeObj.managerId)
      }
    })
    if (managerIdArr.includes(employeeID)) {
      return true
    }
    return false
  }

  const helper = (employeesArr, managerObj) => {
    employeesArr.forEach(employeeObj => {
      if (!isManager(managerObj.id)) {
        return treeObj
      } else if (managerObj.id === employeeObj.managerId) {
        employeeObj.reports = [] // here, you are mutating the employee obj
        // although that's ok for here, maybe we can revisit this during office hours and figure out
        // how to make it immutable (non-mutating). we can talk about benefits and costs of doing this
        // and why we would even bother with it at all
        managerObj.reports.push(employeeObj)
        helper(employeesArr, employeeObj)
      }
    })
    return treeObj
  }
  return helper(employeesArr, treeObj)
}

console.log(JSON.stringify(generateManagementTree(employees), null, 2))
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
spacer('')

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
// I can see what you were trying to do and I think the part you're missing is how to know
// how "deep" you are in the tree. a quick way of doing it is to have a 'depth' parameter in your helper func
// that's set to 0 initially and increments by 1 each time you recurse. then you can use that to know
// how many '-' you need to add!
const displayManagementTree = (treeObj) => {
  let returnedString = ''

  const helper = (employeeObj) => {
    if (employeeObj.reports.length !== 0) {
      returnedString += employeeObj.name + '\n'
      employeeObj.reports.forEach(subObj => {
        //returnedString = helper(subObj);
        return helper(subObj)
      })
    } else {
      returnedString += employeeObj.name + '\n'
    }
    return returnedString
  }
  return helper(treeObj)
}

const s = displayManagementTree(generateManagementTree(employees))
console.log(s)
/*
  moe
  -larry
  --shep
  ---shep Jr.
  -curly
  --groucho
  ---harpo
  -lucy
  */
