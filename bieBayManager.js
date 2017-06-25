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

	inquirer.prompt([
			{
				type: 'list',
				message: 'Choose a selection',
				name: 'managerChoice',
				choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
			}
		]).then (function(response) {
			switch (response.managerChoice) {
				case 'View Products for Sale': 
					viewProducts();
					break;

				case 'View Low Inventory':
					viewLow();
					break;

				case 'Add to Inventory':
					addInventory();
					break;

				case 'Add New Product':
					addProduct();
					break;

				default: "Invalid Coice";


			}
		})
	

		function viewProducts() {
			connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products`", function(err, data) {
				if (err) throw err;

				console.log(data);
			})
		}


})