var mysql = require('mysql');

var inquirer = require('inquirer');

var itemList = [];

var idChosen;

var quantityChosen;

var total;

var changeStock;

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

			if (err) throw err;

			for (var i = 0; i < data.length; i++) {
				itemList.push(data[i]);

				console.log("id", itemList[i].item_id + ":", itemList[i].product_name, "$" + itemList[i].price);

			}




			inquirer.prompt([
					{
						type: 'input',
						message: 'Choose an item by id?',
						name: 'itemChoice',
					}
				]).then(function(response) {
					idChosen = response.itemChoice;

					connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products` WHERE `item_id` = ?", [idChosen], function(err, data) {
						
						if (idChosen > itemList.length) {
							console.log("Product does not exist. Please try again");
							initialPrompt();
						}
						else {
							console.log("You chose", data[0].product_name, "for $" + data[0].price);
					
						checkAmount();
						}
						

						function checkAmount () {
							inquirer.prompt([
									{
										type: 'input',
										message: 'How many ' + data[0].product_name + '\'s would you like?',
										name: 'quantity'
									}
								]).then (function(response) {
									quantityChosen = response.quantity;

									if (data[0].stock_quantity > quantityChosen) {

										total = data[0].price * quantityChosen;

										changeStock = data[0].stock_quantity - quantityChosen;
									
										console.log("Your total is: $" + total);

										connection.query("UPDATE `products` SET `stock_quantity` = ?  WHERE `item_id` = ?", [changeStock, idChosen]);

										inquirer.prompt([
													{
														type: 'list',
														message: 'Would you like to keep shopping?',
														name: 'shop',
														choices: ['Yes', 'No']
													}
											]).then(function(response) {

													if (response.shop === "Yes") {

														initialPrompt();

														total++;
													
													} else {

														console.log("Please pay here.");
													}
											})
									}
									else {
										console.log("Sorry! We do not have enough inventory for your request");
										console.log("We have", data[0].stock_quantity, "total in stock");
										console.log("Please try a different amount");
										checkAmount();
									}
									
								})
						}
					})	
				})

		})
	}		
	
}) 