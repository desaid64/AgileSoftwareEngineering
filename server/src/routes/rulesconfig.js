import express from 'express';
const router = express.Router();
const db = require("../config/db.js");

router.get('/', (req, res) => {
  console.log(req.query);
  const { DepartmentID } = req.query
  const sql = 'call getDepartmentRules(?)';
  db.query(sql, [DepartmentID], (err, [[results]]) => {
    if (err) res.json(err);
    console.log(results);
    res.json(results);
  });
})

export default router