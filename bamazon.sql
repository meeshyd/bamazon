create database Bamazon;

use Bamazon;
CREATE TABLE products(
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR (40) NULL,
department_name VARCHAR (40) NULL,
price DECIMAL (10,2) NULL,
stock_quantity INTEGER (10) NULL,
primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Seinfeld: The Complete Set", "Fun", 50.75, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Omega Brain Yo-yo", "Fun", 14.99, 35);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Basket of Kittens", "Cute", 7149.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Parrot", "Cute", 1500.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Gyro and Fries", "Yummy", 8.50, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Swedish Fish", "Yummy", 1.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pink Hair Dye", "Necessities", 10.50, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Black Pen", "Necessities", 1.00, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fireworks", "Fun", 100.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("WD-40", "Necessities", 3.68, 55);

SELECT * FROM products;