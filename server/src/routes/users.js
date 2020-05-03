import express from 'express';
import commonValidation from '../validations/signup';
import bcrypt from 'bcrypt'; 
import isEmpty from 'lodash/isEmpty';
import jwt from 'jsonwebtoken';
import config from '../config/hidden/config';
let router = express.Router();
var db = require ("../config/db.js");

function validateInput(data,otherValidations){
    let {errors} = otherValidations(data);
    return new Promise(function(resolve, reject) { 
        let identifier; 
        if(data.username){
            identifier = data.username
        }
        else if (data.email){
            identifier = data.email
        }
        //var sql = 'select EmployeeID,Username,PreferredEmail from Employees where Username = ? or PreferredEmail = ?';
        var sql = 'CALL checkUserExistsAndReturnIdentifiers(?)';
        db.query(sql, [identifier], (err, rows, fields) => {
            if (err) throw reject(err);
            if (rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].Username === data.username) {
                        errors.username = "Username already exists";
                    }
                    if (rows[i].PreferredEmail === data.email) {
                        errors.email = "Email already exists";
                    }
                }
            resolve({errors,isValid: isEmpty(errors)});
            }
        });
    })
}

router.get('/:identifier', (req, res) => {
    var sql = 'CALL checkUserExistsAndReturnIdentifiers(?)';
    db.query(sql,[req.params.identifier],(err, rows, fields)=>{
        if (err) throw err;
        res.json(rows[0][0]);
    });
})


router.post('/',(req,res) => {
    validateInput(req.body, commonValidation).then(({errors, isValid}) => {
        if(isValid){
            const { username, password, timezone, email, phoneNumber,language,firstName,lastName } = req.body;
            const password_digest = bcrypt.hashSync(password, 10);
            var sql = 'call InsertAndReturnUser(?,?,?,?,?,?,?,?)';
            //var sql = 'INSERT INTO Employees (Username,Passwd,PreferredEmail,PhoneNumber,PreferredLanguageID,FirstName,LastName,DepartmentID) VALUES (?,?,?,?,?,?,?,?)';
            db.query(sql,[username,password_digest,email,phoneNumber,language,firstName,lastName,104120],(err, rows, fields)=>{
                if (err) throw err;
                console.log(rows[0])
                const token = jwt.sign({
                    id: rows[0][0].EmployeeID,
                    username: rows[0][0].Username,
                    deptId : rows[0][0].DepartmentID,
                    isAdmin : rows[0][0].isAdmin
                }, config.jwtSecret);
                res.json({ token });
            });
        }
        else {
            res.status(400).json(errors);
        }
    });
});
export default router; 