
var mysql = require('mysql');

var pool = mysql.createPool({
	host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
	user: "jay",
	password: "jaypassword",
	database: "jay",
	});
	 
// console.log(connection);
exports.handler =  (event, context, callback) => {
  
  query = "insert into service_pro values(DEFAULT,\'"
  query+= event['name'] + "\',\'"
  query += event['title'] +"\',\'"
  query+= event['description'] + "\',\'"
  query+= event['location'] + "\',"
  query+= 'now()' + ",\'"
  query+= event['id_pro'] + "\'"
  query+= event['category'] + ");"
   
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
