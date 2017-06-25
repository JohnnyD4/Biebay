var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({

	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bieBay'

})

connection.connect(function(err) {
	if (err) throw err;

	console.log("Welcome to the Bieber Outlet!");
	console.log("-----------------------------------");

	initialPrompt();


	function initialPrompt() {

		connection.query("SELECT `item_id`, `product_name`, `price` FROM `products`", function(err, data) {

			if (err)
		})

		inquirer.prompt([
				{
					type: 'list',
					message: 'What would you like to buy?',
					choices: 
				}
			])
	}
}) 