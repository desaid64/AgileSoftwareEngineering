var mysql = require('mysql');
const config = require('./config.js');

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password:config.db.password,
    database: "HotelManagement",
    insecureAuth: true,
    multipleStatements:true
})
connection.connect(function (err){
    if (err) throw err;
    console.log("Connected to database!");
});


module.exports = connection;