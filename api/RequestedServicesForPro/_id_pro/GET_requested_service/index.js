var mysql = require('mysql');

var pool = mysql.createPool({
    host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
    user: "jay",
    password: "jaypassword",
    database: "jay",
});

// console.log(connection);
exports.handler =  (event, context, callback) => {
    let sql = 'SELECT * FROM requested_service WHERE requested_service.servicepro IN '
        + '( SELECT service_pro.id FROM service_pro WHERE service_pro.pro = ?);'
    let data = [event.pathParams.id_pro];    
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, data, function (error, results, fields) {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error) {
                var myErrorObj = {
                    errorType : "InternalServerError",
                    httpStatus : 500,
                    requestId : context.awsRequestId,
                    trace : {
                        "function": "get_requested_services_pro()",
                        "line": 18,
                        "file": "index.js"
                    }
                }
                callback(JSON.stringify(myErrorObj));
            }
            else {
                callback(null, results);
            }
        });
    });
};