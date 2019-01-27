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
    let sql = 'UPDATE service_user SET payd = CASE WHEN validated=1 THEN 1 ELSE 0 END WHERE id=?';
    let data = [event._id];
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
                if(results.changedRows === 0) {
                    callback(null, "service_user state payd DID NOT change!" +
                        "That service is already paid");
                } else
                    callback(null, "service_user state payd changed!");
            }
        });
    });
};