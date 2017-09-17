var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});


function afterConnection() {
  inquirer.prompt([
    {
      name: "options",
      type: "list",
      message: "Please select an option.",
      choices: ["View Product Sales by Department", "Create New Department"]
    }
  ]).then(function (answer) {
    if (answer.options === "View Product Sales by Department") {
      departmentSales();
    } else {
      newDepartment();
    }
  });
}


function departmentSales() {
  connection.query(
    "SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM (products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.overhead_costs) AS total_profits FROM departments INNER JOIN products ON (products.department_name = departments.department_name) GROUP BY departments.department_id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    });
  connection.end();
}


function newDepartment() {
  inquirer.prompt([
    {
      name: "name",
      message: "What is the name of the new department?"
    },
    {
      name: "overhead",
      message: "What is the overhead of this department?"
    }
  ]).then(function (answer) {
    connection.query(
      "INSERT INTO departments SET ?", {
        department_name: answer.name,
        overhead_costs: answer.overhead
      },
      function (err, res) {
        if (err) throw err;
        console.log(answer.name + " has been added to the database.");
      });
    connection.end()
  });
}
