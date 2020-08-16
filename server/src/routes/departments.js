import express from 'express';
import authenticate from '../middlewares/authenticate.js';
const router = express.Router();
const db = require("../config/db.js");

router.get('/', authenticate, (req, res) => {
  const sql = req.isAdmin ?
    'select DepartmentID, DepartmentName from Departments order by DepartmentName'
    :
    `select DepartmentName from Departments where DepartmentID=${req.deptId}`
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.json(results);

  });
})

export default router