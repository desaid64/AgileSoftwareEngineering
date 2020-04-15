import express from 'express';
import commonValidation from '../validations/signup';
import bcrypt from 'bcrypt'; 
import isEmpty from 'lodash/isEmpty';
let router = express.Router();
var db = require ("../config/db.js");

function validateInput(data,otherValidations){
    let {errors} = otherValidations(data);
    return new Promise(function(resolve, reject) { 
        var sql = 'select EmployeeID,Username,PreferredEmail from Employees where Username = ? or PreferredEmail = ?';
        db.query(sql, [data.username, data.email], (err, rows, fields) => {
            if (err) throw reject(err);
            console.log("user.js validateInput")
            console.log(rows)
            if (rows) {
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
    var sql = 'select Username,PreferredEmail from Employees where Username = ? or PreferredEmail = ?';
    db.query(sql,[req.params.identifier,req.params.identifier],(err, rows, fields)=>{
        if (err) throw err;
        console.log("users.js")
        console.log(rows[0]);
        res.json(rows[0]);
    });
})


router.post('/',(req,res) => {
    validateInput(req.body, commonValidation).then(({errors, isValid}) => {
        console.log(isValid)
        if(isValid){
            const { username, password, timezone, email, phoneNumber,language,firstName,lastName } = req.body;
            const password_digest = bcrypt.hashSync(password, 10);
            console.log(username,password_digest,email,phoneNumber,language,firstName,lastName);
            var sql = 'INSERT INTO Employees (Username,Passwd,PreferredEmail,PhoneNumber,PreferredLanguageID,FirstName,LastName) VALUES (?,?,?,?,?,?,?)';
            db.query(sql,[username,password_digest,email,phoneNumber,language,firstName,lastName],(err, rows, fields)=>{
                if (err) throw err;
                res.json({ success: true });
            });
        }
        else {
            res.status(400).json(errors);
        }
    });
});
export default router; 