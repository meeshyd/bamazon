const mysql = require("mysql");
const inquirer = require("inquirer");
require('console.table');

var connection = mysql.createConnection({
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
    	storeOptions();
	});
};

function storeOptions() {

	inquirer.prompt([{
    	name: "id",
    	type: "input",
    	message: "What is the ID of the item you would like to buy?"
    	}, 
    	{
		name: "quantity",
		type: "input",
		message: "How many would you like to buy?"
		
	}]).then(function(answer) {

		const queryStr = "SELECT * FROM products WHERE ?";

		connection.query(queryStr, {item_id: answer.id} , function(err, res) {
			let result = res[0];

			if (err) throw err;
			
			if (answer.quantity <= result.stock_quantity){
				connection.query("UPDATE products SET ? WHERE ?", [{
  					stock_quantity: result.stock_quantity - answer.quantity
					}, {
					item_id: answer.id
					}], function(err, res) {
						if (err) throw err;
					});
				
				console.log("\n\nYou total cost: $"+
					result.price * answer.quantity + "."+
					"\nThank you for your purchase!\n");

				stayOrLeave();

			} else {
			    console.log("Sorry, there is not enough in stock!\nPlease try again with a valid quantity.")
			    storeOptions();
			};
		});

	});
};

function stayOrLeave (){
	inquirer.prompt([{
    	name: "stayOrLeave",
    	type: "list",
    	message: "What would you like to do?",
    	choices: ["Keep shopping", "Leave MeeshyD's Superstore"]
	}]).then(function(answer) {
		if (answer.stayOrLeave==="Keep shopping"){
			showInventory();
		}else{
			console.log("\n\nThank you for visiting. Please come back soon!\n\n")
			process.exit()
		};
	});
};
showInventory();