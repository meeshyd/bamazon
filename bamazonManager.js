const mysql = require("mysql");
const inquirer = require("inquirer");
require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"

});
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with a inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

function showInventory() {
	console.log("---------------------------\nMEESHYD'S MANAGEMENT PORTAL\n---------------------------\nFULL INVENTORY\n---------------------------\n");
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	managerOptions();
	});
};



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
		connection.query("SELECT * FROM products WHERE ?", {item_id: answer.id} , function(err, res) {
			let result = res[0];

			if (err) {
				console.log("Error retrieving data or invalid entry. Please try again.");
				addInventory();
			} else {
				let newQuantity = parseInt(answer.quantity) + result.stock_quantity;
				connection.query("UPDATE products SET ? WHERE ?", [{
	  				stock_quantity: newQuantity
					}, {
					item_id: answer.id
				}], function(err, res) {
					if (err) throw err;
				});
				console.log("\nInventory was updated successfully!")
				showInventory();
			};
		});		
	});
};

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

	    connection.query("INSERT INTO products SET ?", {
	      product_name: answer.product,
	      department_name: answer.department,
	      price: answer.price,
	      stock_quantity: answer.quantity
	    }, function(err) {
	      if (err) {
	      	console.log("Error retrieving data or invalid entry. Please try again.")
	      	addNewProduct();
	      } else {
	      	console.log("\nNew product was added successfully!");
	    	showInventory();
	      };
	    
	    });
	});
};
showInventory();




