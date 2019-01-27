var mysql = require('mysql');

var pool = mysql.createPool({
	host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
	user: "jay",
	password: "jaypassword",
	database: "jay",
	});
	 
// console.log(connection);
exports.handler =  (event, context, callback) => {
	var query = "select * from service_pro where pro="
	query += event["id_pro"]
	query += ";"
	var results ="code 200"
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  
pool.getConnection(function(err, connection) {
    
    connection.query(query, function (error, results, fields) {
      
      connection.release();
      
      if (error) callback(error);
      else callback(null,results);
    });
  });
};

