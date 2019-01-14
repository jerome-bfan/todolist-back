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
    let sql = 'UPDATE service_user SET payd = ? WHERE id = ?';
    let data = [event.payd, event._id];
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
                console.log("Failure to update payd column to service_user");
                callback(error);
            }
            else {
                callback(null,results);
            }
        });
    });
};

