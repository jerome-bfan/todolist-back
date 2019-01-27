var mysql = require('mysql');

var pool = mysql.createPool({
    host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
    user: "jay",
    password: "jaypassword",
    database: "jay",
});

// console.log(connection);
exports.handler =  (event, context, callback) => {
    
    let sql = 'UPDATE requested_service SET paid = CASE WHEN validated=1 THEN 1 ELSE 0 END WHERE id=?';
    let data = [event.pathParams.id_requested_service];
    
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, data, function (error, results, fields) {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error) {
                
                callback(error,"Failure to update payd column to requested_service");
            }
            else {
                if(results.changedRows === 0) {
                    callback(null, "requested_service state payd DID NOT change!" +
                        "You CAN'T modify this requested_service because it's validated");
                } else
                    callback(null, "requested_service state paid changed!");
            }
        });
    });
};

