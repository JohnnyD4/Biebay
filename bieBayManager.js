var mysql = require('mysql');

var inquirer = require('inquirer');

var items = [];

var itemUpdated;

var connection = mysql.createConnection({
	
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bieBay'

})

connection.connect(function(err) {
	if (err) throw err;

	runManager();

function runManager() {
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
					addNewProduct();
					break;

				default: 
					console.log("Invalid Choice");


			}
		})
}	

		function viewProducts() {
			
			connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products`", function(err, data) {
				
				if (err) throw err;

				for (var i = 0; i < data.length; i++) {
					
					console.log("ID:",  data[i].item_id, "PRODUCT:", data[i].product_name, "PRICE: $" + data[i].price, "STOCK QUANTITY:", data[i].stock_quantity);
				}
				
			})
		}

		function viewLow() {
			
			connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products` WHERE `stock_quantity` < 12", function(err, data) {

				if (err) throw err;

				for (var i = 0; i < data.length; i++) {

					console.log("ID:",  data[i].item_id, "PRODUCT:", data[i].product_name, "PRICE: $" + data[i].price, "STOCK QUANTITY:", data[i].stock_quantity);

				}
			})	
		}

		function addInventory() {

			connection.query("SELECT `product_name` FROM `products`", function(err, data) {

				for (var i = 0; i < data.length; i++) {

					items.push(data[i].product_name);

					// console.log(items);
				}
			
				inquirer.prompt([
						{
							type: 'list',
							message: 'What product would you like to update the inventory on?',
							name: 'updated',
							choices: items
						}
					]).then(function(response) {

						itemUpdated = response.updated;

						inquirer.prompt([
								{
									type: 'input',
									message: 'Add amount of inventory being added',
									name: ''
								}
							])
						connection.query("UPDATE `products` SET `stock_quantity` WHERE `product_name` = ?", [itemUpdated], function(err, data) {

							if (err) throw err;

							console.log("Updated stock inventory.");
						})
					
					})
				
				
			})

		}

		function addNewProduct() {

			inquirer.prompt([
					{
						type: 'input',
						message: 'Product Name:',
						name: 'productName'
					},

					{
						type: 'input',
						message: 'Department Name:',
						name: 'departmentName'
					},

					{
						type: 'input',
						message: 'Price:',
						name: 'price'
					},

					{
						type: 'input',
						message: 'Stock Quantity:',
						name: 'stock'
					},

					{
						type: 'input',
						message: 'Autographed:',
						name: 'sign'
					}
				]).then(function(response) {

					connection.query("INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`, `autographed`) VALUES (?, ?, ?, ?, ?)", [response.productName, response.departmentName, response.price, response.stock, response.sign], function(err, data) {

						if (err) throw err;

						console.log("Updated Database");
					})
				})
				
		}


})