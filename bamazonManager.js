var mysql = require("mysql");
var inquirer = require("inquirer");

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
      type: "list",
      name: "select",
      message: "Welcome. Please select an option.",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
  ]).then(function (answer) {
    switch (answer.select) {
      case "View Products for Sale":
        viewProducts();
        break;
      case "View Low Inventory":
        lowInventory();
        break;
      case "Add to Inventory":
        addInventory();
        break;
      case "Add New Product":
        newProduct();
    }
  });
}


function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n Product Name: " + res[i].product_name + "\n Price: $" + res[i].price + "\n Stock Quantity: " + res[i].stock_quantity + "\n");
    }
  });
  connection.end();
}


function lowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        console.log("Item ID: " + res[i].item_id + "\n Product Name: " + res[i].product_name + "\n Price: $" + res[i].price + "\n Stock Quantity: " + res[i].stock_quantity + "\n");
      }
    }
  });
  connection.end();
}


function addInventory() {
  var itemArray = [];
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      itemArray.push(res[i].product_name);
    }
    inquirer.prompt([
      {
        type: "list",
        name: "itemChoice",
        message: "To which item would you like to add more?",
        choices: itemArray
      },
      {
        name: "addAmount",
        message: "How much would you like to add?"
      }
    ]).then(function (answer) {
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name === answer.itemChoice) {
          chosenItem = res[i].product_name;
          var stockQuantity = res[i].stock_quantity;
        }
      }
      var addAmount = parseInt(answer.addAmount) + stockQuantity;
      connection.query(
        "UPDATE products SET ? WHERE ?", [
          {
            stock_quantity: addAmount
        },
          {
            product_name: chosenItem
        }
        ],
        function (err) {
          if (err) throw err;
          console.log("The stock quantity of " + chosenItem + " is now " + addAmount + ".");
        });
      connection.end();
    });
  });
}


function newProduct() {
  inquirer.prompt([
    {
      name: "name",
      message: "What is the name of the item you would like to add?"
    },
    {
      name: "department",
      message: "To which department does this item belong?"
    },
    {
      name: "price",
      message: "How much does this item cost? Please enter numbers only."
    },
    {
      name: "stock",
      message: "How many of this item are in stock?"
    }
  ]).then(function (answer) {
    connection.query(
      "INSERT INTO products SET ?", 
      {
        product_name: answer.name,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.stock
      },
      function (err, res) {
        if (err) throw err;
        console.log(answer.name + " has been added to the database.");
      });
    connection.end()
  });
}
