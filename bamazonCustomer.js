//requiring npm packages needed for app
const mysql = require("mysql");
const inquirer = require("inquirer");
require('console.table');

//require MySQL configuration object and create connection
const config = require('./config.js');
const connection = mysql.createConnection(config);

//show inventory displays the full store inventory to customer and also calls the customerPurchase funtion
function showInventory() {
	console.log("\n---------------------\nMEESHYD'S SUPERSTORE\n---------------------\n")
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	customerPurchase();
	});
};

//customerPurchase uses inquirer package to request information from customer about the item they would like to purchase
function customerPurchase() {
	inquirer.prompt([{
    	name: "id",
    	type: "input",
    	message: "Welcome! Please enter the ID # of the item you would like to purchase:",
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
	//when required information is received, 	
	}]).then(function(answer) {
		//use SQL query to find item in products table within database
		connection.query("SELECT * FROM products WHERE ?", {item_id: answer.id} , function(err, res) {
			let result = res[0];
			//if item is not found, log error and present the customer with their options again
			if (err) {
				console.log("Error retrieving data or invalid entry. Please try again.");
				customerPurchase();
			} else {
				//if item is found, verify enough item is in stock. if true, customer purchase is successful.
				//update item quantity in database, display total cost to user, call stayOrLeave function
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
				//if there is not enough item in stock to purchase, log error. present user with their original options
				} else {
				    console.log("Sorry, there is not enough in stock!\nPlease try again with a valid quantity.");
				    customerPurchase();
				};
			};

		});

	});
};
//stayOrLeave is called after successful purchase.
//it presents the customer with the options to either continue shopping or leave the store.
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