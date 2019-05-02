var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
    // dept();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // console.table(res);

        inquirer.prompt([
            {
              name: "choice",
              type: "rawlist",
            //   choices: function() {
            //     var choiceArray = ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
            //     for (var i = 0; i < res.length; i++) {
            //       choiceArray.push(res[i].item_name);
            //     }
            //     return choiceArray;
            //   },
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "What would you like to do?"
            }
            // {
            //   name: "quantity",
            //   type: "input",
            //   message: "How many would you like to buy?"
            // }
        ]).then(function(answer) {
                var ans = answer.choice;
                switch (ans) {
                case "View Products for Sale":
                    function VPS() {
                        connection.query('SELECT * FROM products', 
                        function(err, res) {
                            console.table(res)
                        }
                        )};
                    VPS();
                    connection.end();
                break;
                case "View Low Inventory":
                    function VLI() {
                        connection.query('SELECT * FROM products WHERE stock_quantity <= 5',
                        function(err, res) {
                            console.table(res);
                        })
                    }
                    VLI();
                    connection.end();
                break;
                case "Add to Inventory":
                    
                    function ATI(){    
                        
                        function go () {inquirer.prompt([{
                            name: "choice",
                            type: "rawlist",
                            choices: ["Piano", 'Violin', 'Tuba', 'Bass', 'Accordion',
                                    'Electric Kettle', 'Refridgerator', 'Microwave', 'Water Heater', 'Fan'],
                            message: "Please select the product you would like to add."
                        }, {
                            name: "quantity",
                            type: "input",
                            message: "How many are there now?"
                        }
                        ]).then(function(answer){
                            var ans = answer.choice;
                            var quant = parseInt(answer.quantity);
                            // console.log(ans);
                            // console.log(quant);
                            var existing;
                            // connection.query('SELECT stock_quantity FROM products WHERE ?', [{
                            //     product_name : ans
                            // }], function(err, res) {
                            //     if(err) throw err;
                                
                            //     existing = res[0].stock_quantity

                            // })
                            connection.query('UPDATE products SET ? where ?', [{
                                stock_quantity : quant
                            },{
                                product_name : ans
                            }]);
                            console.log("The quantity of " + ans + " has been updated!");
                            connection.end()
                        })
                        ;
                    }     
                        go();
                        
                    }
                    ATI();
                break;
                case "Add New Product":
                    function ANP () {
                        inquirer.prompt([{
                            name: "choice",
                            type: "input",
                            message: "What is the name of the product you would like to add?"
                        }, {
                            name: "dept",
                            type: "input",
                            message: "In what department is the item?"
                        }, {
                            name: "price",
                            type: "input",
                            message: "What is the price of the product?"
                        }, {
                            name: "quant",
                            type: "input",
                            message: "How many of these do we have in stock?"
                        }])
                        .then(function(answer) {
                            console.log(answer);
                            var name = answer.choice;
                            var dept = answer.dept;
                            var price = answer.price;
                            var quant = answer.quant;

                            connection.query("INSERT INTO products SET ?",
                            // (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)
                                {   
                                product_name: name,
                                department_name: dept,
                                price: price,
                                stock_quantity: quant
                                },
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("Product Added!")
                                })
                            connection.end();
                        })
                    }
                    ANP();
                break;
                }
        })
    });
  }
  
  function dept() {
      connection.query("SELECT * FROM products WHERE department_name = 'Music'", function(err, res) {
          if (err) throw err;
          console.log(res);
          connection.end();
      })
  }
