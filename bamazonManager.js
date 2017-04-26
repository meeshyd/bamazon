//requiring npm packages needed for app
const mysql = require("mysql");
const inquirer = require("inquirer");
require('console.table');

//require MySQL configuration object and create connection
const config = require('./config.js');
const connection = mysql.createConnection(config);

//show inventory displays the full store inventory to customer and also calls the managerOptions funtion
function showInventory() {
	console.log("---------------------------\nMEESHYD'S MANAGEMENT PORTAL\n---------------------------\nFULL INVENTORY\n---------------------------\n");
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	managerOptions();
	});
};
//managerOptions presents user with list of available actions using the inquirer package.
//based on the user selection, a switch function then executes the appropriate function
function managerOptions() {
	inquirer.prompt({
    	name: "options",
    	type: "list",
    	message: "Select an option:",
    	choices:["View Products for Sale",
    			"View Low Inventory",
    			"Add to Inventory",
    			"Add New Product",
    			"Exit"]
	}).then(function(answer) {
		switch (answer.options) {

			case "View Products for Sale":
			showInventory();
			break;

			case "View Low Inventory":
			showLowInventory();
			break;

			case "Add to Inventory":
			addInventory();
			break;

			case "Add New Product":
			addNewProduct();
			break;

			case "Exit":
			process.exit();
			break;
		}
	});
};
//showLowInventory displays items from products table in bamazon database
//that have a stock quantity < 5.
function showLowInventory(){
	const query = "SELECT * FROM products WHERE stock_quantity<5";

    connection.query(query, function(err, res) {
       	if (err) {
	      	console.log("Error retrieving inventory. Please try again.");
	      	managerOptions();
	    } else {
	    	console.log("\n-------------\nLOW INVENTORY\n-------------\n")
	    	console.table(res)
	    	managerOptions();
    	};
    });
};
//addInventory uses inquirer to obtain item ID and quantity from user
// and updates the products table in the bamazon database with new stock
function addInventory(){
	inquirer.prompt([{
    	name: "id",
    	type: "input",
    	message: "Enter item ID:",
    	validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
    }, 
    {
		name: "quantity",
		type: "input",
		message: "Enter number of additional inventory:",
		validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
		
	}]).then(function(answer) {
		//then use a SQL query to find item in products table
		connection.query("SELECT * FROM products WHERE ?", {item_id: answer.id} , function(err, res) {
			let result = res[0];
			//if error, log to console and call function again to start over
			if (err) {
				console.log("Error retrieving data or invalid entry. Please try again.");
				addInventory();
			//if item is found, update item in table with new quantity
			} else {
				let newQuantity = parseInt(answer.quantity) + result.stock_quantity;
				connection.query("UPDATE products SET ? WHERE ?", [{
	  				stock_quantity: newQuantity
					}, {
					item_id: answer.id
				}], function(err, res) {
					if (err) throw err;
				});
				//log success message to console and call showInventory to return to original options
				console.log("\nInventory was updated successfully!")
				showInventory();
			};
		});		
	});
};
//addNewProduct uses inquirer to obtain new product information
//and adds the new product to the products table in bamazon database
function addNewProduct(){
	inquirer.prompt([{
	    name: "product",
	    type: "input",
	    message: "Enter a product name:"
	  }, {
	    name: "department",
	    type: "list",
	    message: "Select a Department:",
	    choices: ["Fun","Cute","Yummy","Necessities"]
	  }, {
	    name: "price",
	    type: "input",
	    message: "Enter price:",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	  	name: "quantity",
	    type: "input",
	    message: "Enter quantity:",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      return false;
	    }
	  }]).then(function(answer) {
	  	//using SQL to add new item to the products table using the information obtained with inquirer
	    connection.query("INSERT INTO products SET ?", {
	      product_name: answer.product,
	      department_name: answer.department,
	      price: answer.price,
	      stock_quantity: answer.quantity
	    }, function(err) {
	     //if error, log to console and call function again to start over
	      if (err) {
	      	console.log("Error retrieving data or invalid entry. Please try again.")
	      	addNewProduct();
	     //log success message to console and call showInventory to return to original options
	      } else {
	      	console.log("\nNew product was added successfully!");
	    	showInventory();
	      };
	    
	    });
	});
};
showInventory();




