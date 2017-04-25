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

function showInventory() {
	console.log("\n---------------------\nMEESHYD'S SUPERSTORE\n---------------------\n")
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	customerOptions();
	});
};

function customerOptions() {

	inquirer.prompt([{
    	name: "id",
    	type: "input",
    	message: "What is ID number of the item you would like to purchase?",
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
		message: "How many would you like to buy?",
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
				customerOptions();
			} else {
			
				if (answer.quantity <= result.stock_quantity){
					let newQuantity = parseInt(result.stock_quantity) - parseInt(answer.quantity);
					connection.query("UPDATE products SET ? WHERE ?", [{
	  					stock_quantity: newQuantity
						}, {
						item_id: answer.id
						}], function(err, res) {
							if (err) throw err;
						});
					let total = result.price * parseInt(answer.quantity)
					console.log("\n\nYou total cost: $"+ total +
						"\nThank you for your purchase!\n");

					stayOrLeave();

				} else {
				    console.log("Sorry, there is not enough in stock!\nPlease try again with a valid quantity.");
				    customerOptions();
				};
			};

		});

	});
};

function stayOrLeave (){
	inquirer.prompt({
    	name: "stayOrLeave",
    	type: "list",
    	message: "What would you like to do now?",
    	choices: ["Keep shopping", "Leave MeeshyD's Superstore"]
	}).then(function(answer) {
		if (answer.stayOrLeave==="Keep shopping"){
			showInventory();
		}else{
			console.log("\n\nThank you for visiting. Please come back soon!\n\n")
			process.exit()
		};
	});
};
showInventory();