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
	console.log("\n--------------\nFULL INVENTORY\n--------------\n")
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	console.table(res);
    	managerOptions();
	});
};

function managerOptions() {
	console.log("\n---------------------------\nMEESHYD'S MANAGEMENT PORTAL\n---------------------------\n")
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
      console.log("\n-------------\nLOW INVENTORY\n-------------\n")
      console.table(res)
      managerOptions();
    });
}
function addInventory(){
	console.log("add inventory function goes here");
	managerOptions();
}
function addNewProduct(){
	console.log("add new product function goes here");
	managerOptions();
}
managerOptions();