DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  product_sales INT default 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  overhead_costs INT default 0,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cat", "Animals", "100", "40"), ("Cat mug", "Dishware", "2", "800"), ("Cat t-shirt", "Clothing", "10", "3"), ("Cat hat", "Outerwear", "15", "3000"), ("Cat pencil", "Office supplies", "9", "25"), ("Cat slippers", "Footwear", "44", "70"), ("Cat tea cozy", "Kitchen", "23", "61"), ("Cat jacket", "Outerwear", "33", "31"), ("Cat TV", "Electronics", "28", "400"), ("Cat salt and pepper shakers", "Kitchen", "752", "6");

INSERT INTO	departments (department_name, overhead_costs)
VALUES ("Animals", "25"), ("Dishware", "100"), ("Clothing", "59"), ("Outerwear", "210"), ("Office supplies", "900"), ("Footwear", "32"), ("Kitchen", "300"), ("Electronics", "445");

