import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/hidden/config';
let router = express.Router();
var db = require ("../config/db.js");

router.post('/', (req, res) => {
    const { identifier, password } = req.body;
    var sql = 'select * from Employees where Username = ? or PreferredEmail = ?';
    db.query(sql,[identifier,identifier],(err, rows, fields)=>{
        if (err) throw err;
        if(rows.length > 0){
            if(rows[0].Passwd){
                if(bcrypt.compareSync(password,rows[0].Passwd)){
                    const token = jwt.sign({
                        id: rows[0].EmployeeID,
                        username: rows[0].Username,
                        deptId : rows[0].DepartmentID,
                        isAdmin : rows[0].isAdmin
                    }, config.jwtSecret);
                    res.json({ token });
                }  else {
                res.status(401).json({ errors: { form: 'Invalid Credentials' } });
                }
            } else {
                res.status(401).json({ errors: { form: 'Invalid Credentials' } });
            }
        } else {
            res.status(401).json({ errors: { form: 'Invalid Credentials' } });
        }
    });
});

export default router; 