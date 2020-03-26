import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/hidden/config';
let router = express.Router();
var db = require ("../config/db.js");

router.post('/', (req, res) => {
    const { identifier, password } = req.body;
    var sql = 'select * from users where username = ? or email = ?';
    db.query(sql,[identifier,identifier],(err, rows, fields)=>{
        if (err) throw err;
        if(rows[0].password){
            if(bcrypt.compareSync(password,rows[0].password)){
                const token = jwt.sign({
                    id: rows[0].id,
                    username: rows[0].username
                  }, config.jwtSecret);
                  res.json({ token });
            }  else {
                res.status(401).json({ errors: { form: 'Invalid Credentials' } });
            }
        } else {
            res.status(401).json({ errors: { form: 'Invalid Credentials' } });
        }
    });
});

export default router; 