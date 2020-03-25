import express from 'express';
import commonValidation from '../shared/validations/signup';
import bcrypt from 'bcrypt'; 
import isEmpty from 'lodash/isEmpty';
let router = express.Router();
var db = require ("../config/db.js");

function validateInput(data,otherValidations){
    let {errors} = otherValidations(data);
    return new Promise(function(resolve, reject) { 
        var sql = 'select id,username,email from users where username = ? or email = ?';
        db.query(sql, [data.username, data.email], (err, rows, fields) => {
            if (err) throw reject(err);
            if (rows) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].username === data.username) {
                        errors.username = "Username already exists";
                    }
                    if (rows[i].email === data.email) {
                        errors.email = "Email already exists";
                    }
                }
            resolve({errors,isValid: isEmpty(errors)});
            }
        });
    })
}

router.get('/:identifier', (req, res) => {
    var sql = 'select username,email from users where username = ? or email = ?';
    db.query(sql,[req.params.identifier,req.params.identifier],(err, rows, fields)=>{
        if (err) throw err;
        //console.log(rows);
        res.json(rows[0]);
    });
})


router.post('/',(req,res) => {
    validateInput(req.body, commonValidation).then(({errors, isValid}) => {
        console.log(isValid)
        if(isValid){
            const { username, password, timezone, email } = req.body;
            const password_digest = bcrypt.hashSync(password, 10);
            //console.log(username,password_digest,email,timezone,password);
            var sql = 'INSERT INTO users (username, email,password) VALUES (?,?,?)';
            db.query(sql,[username,email,password_digest],(err, rows, fields)=>{
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