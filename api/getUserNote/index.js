var mysql = require('mysql');

var pool = mysql.createPool({
	host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
	user: "jay",
	password: "jaypassword",
	database: "jay",
	});
	 
// console.log(connection);
exports.handler =  (event, context, callback) => {
	var query = "INSERT INTO note VALUES(DEFAULT,\'"
	query += "eu-west-1:c72978e3-2d1a-4e61-a913-ba1f5e13ea08"
	query += "\',\'"
	query += event["note"]
	query += "\');"
	var results ="code 200"
  //prevent timeout from waiting event loop
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection(function(err, connection) {
    // Use the connection
    connection.query(query, function (error, results, fields) {
      // And done with the connection.
      connection.release();
      // Handle error after the release.
      if (error) callback(error);
      else callback(null,results);
    });
  });
};
