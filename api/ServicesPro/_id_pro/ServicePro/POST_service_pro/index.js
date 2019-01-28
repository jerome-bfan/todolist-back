var mysql = require('mysql');

var pool = mysql.createPool({
    host: "jay.czsbtwrelfgz.eu-west-1.rds.amazonaws.com",
    user: "jay",
    password: "jaypassword",
    database: "jay",
});

// console.log(connection);
exports.handler =  (event, context, callback) => {
    let sql = 'INSERT INTO service_pro VALUES (DEFAULT, ?, ?, ?, ?, now(), ?, ?, ?, DEFAULT);';
    let data = [];
    data.push(
        event.body.name,
        event.body.title,
        event.body.description,
        event.body.location,
        event.pathParams.id_pro,
        event.body.category,
        event.body.prix
    );
    
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, data,function (error, results, fields) {
            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error) {
                var myErrorObj = {
                    errorType : "InternalServerError",
                    httpStatus : 500,
                    requestId : context.awsRequestId,
                    trace : {
                        "function": "insert_service_pro()",
                        "line": 26,
                        "file": "index.js"
                    }
                }
                callback(JSON.stringify(myErrorObj));
            }
            else {
                callback(null, "Service pro successfully created");
            }
        });
    });
};