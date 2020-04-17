import express from 'express';
const router = express.Router();
const db = require("../config/db.js");

router.get('/', (req, res) => {
  var sql = 'select DepartmentID, DepartmentName from Departments order by DepartmentName';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
})

export default router