var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n Product Name: " + res[i].product_name + "\n Price: $" + res[i].price + "\n");
    }
    inquirer.prompt([
      {
        name: "itemID",
        message: "What is the ID of the item you would like to buy?"
      },
      {
        name: "quantity",
        message: "How many units would you like to buy?"
      }
      ]).then(function (answer) {
      var chosenItem;
      for (var i = 0; i < res.length; i++) {
        if (res[i].item_id === parseInt(answer.itemID)) {
          chosenItem = res[i];
        }
      }
      if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
        var quantLeft = chosenItem.stock_quantity - parseInt(answer.quantity);
        var totalCost = parseInt(answer.quantity) * chosenItem.price
        connection.query(
          "UPDATE products SET ? WHERE ?", [
            {
              stock_quantity: quantLeft
              },
            {
              item_id: chosenItem.item_id
              }
            ],
          function (err) {
            if (err) throw err;
            console.log("Order successful! Your total cost is $" + totalCost);
            //              start();
          }
        );
      } else {
        // bid wasn't high enough, so apologize and start over
        console.log("Insufficient Quantity!");
        //          start();
      }
      connection.end();
    });

  });

}
