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
    let sql = 'INSERT INTO user VALUES (?, ?,?, ?, ?, ?);';
    let data = [];
    
    for (var i in event.body) {
        data.push([i,event.body[i]]);
    }
    
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
                        "function": "post_user()",
                        "line": 21,
                        "file": "index.js"
                    }
                }
                callback(JSON.stringify(myErrorObj));
            }
            else {
                callback(null, "User successfully created");
            }
        });
    });
};