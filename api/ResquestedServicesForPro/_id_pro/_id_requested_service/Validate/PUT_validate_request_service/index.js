var mysql = require('mysql');

var pool = mysql.createPool({
    host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
    user: "jay",
    password: "jaypassword",
    database: "jay",
});

// console.log(connection);
exports.handler =  (event, context, callback) => {
    //Update validated
    let sql = 'UPDATE requested_service SET validated =  CASE ' +
        'WHEN paid=1 THEN 1 ' +
        'WHEN (paid=0 AND validated=0) THEN 1 ' +
        'ELSE 0 ' +
        'END WHERE id=?';
    let data = [event._id];
    console.log(event);
    console.log(sql, data);
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, data, function (error, results, fields) {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error) {
                console.log("Failure to update validated column to service_user");
                callback(error);
            }
            else {
                if(results.changedRows === 0) {
                    callback(null, "service_user state validated DID NOT change!");
                } else
                    callback(null, "service_user state validated changed!");
            }
        });
    });
};

