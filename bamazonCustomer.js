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
        console.table(res);

        inquirer.prompt([
            {
              name: "choice",
              type: "input",
            //   choices: function() {
            //     var choiceArray = [];
            //     for (var i = 0; i < res.length; i++) {
            //       choiceArray.push(res[i].item_name);
            //     }
            //     return choiceArray;
            //   },
              message: "Please give the item_id of the product you would like to buy"
            },
            {
              name: "quantity",
              type: "input",
              message: "How many would you like to buy?"
            }
        ]).then(function(answer) {
            
            connection.query('SELECT * FROM products where ?', 
                {
                    item_id : answer.choice
                },
                function(err, res) {
                    if (err) throw err;
                    var SQ = res[0].stock_quantity;
                    if (res[0].stock_quantity >= answer.quantity) {
                        console.log('Your cost is: $' + res[0].price*answer.quantity);
                        // var quantSold = res[0].stock_quantity;
                        connection.query('UPDATE products SET ? WHERE ?',
                            [{
                                stock_quantity : SQ - answer.quantity
                            },{
                                item_id : answer.choice
                            }],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " products updated!\n");
                            }
                           
                        );
                        connection.end();
                    }else{
                        console.log('Insufficient Quantity!');
                        connection.end();
                    }
                })

            
        })

    //   connection.end();
    });
  }

  function dept() {
      connection.query("SELECT * FROM products WHERE department_name = 'Music'", function(err, res) {
          if (err) throw err;
          console.log(res);
          connection.end();
      })
  }
