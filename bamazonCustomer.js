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
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	storeOptions();
	});
};

function storeOptions() {
	// The first should ask them the ID of the product they would like to buy.
	// The second message should ask how many units of the product they would like to buy.
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
			
			if (err) throw err;
			
			if (answer.quantity <= res[0].stock_quantity){
			    //TODO
			    // This means updating the SQL database to reflect the remaining quantity.
				// Once the update goes through, show the customer the total cost of their purchase.
			} else {
			    console.log("Sorry, there is not enough in stock!\nPlease try again with a valid quantity.")
			    storeOptions();
			};
		});

	});
};

showInventory();