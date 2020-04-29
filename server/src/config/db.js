var mysql = require('mysql');
const config = require('./hidden/config.js');

var connection = mysql.createPool({
  connectionLimit: 100,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: "HotelManagement_Team_2",
  insecureAuth: true,
  multipleStatements: true
})
// pool.getConnection(function (err) {
//   if (err) throw err;
//   console.log("Connected to database!");
// });


module.exports = connection;