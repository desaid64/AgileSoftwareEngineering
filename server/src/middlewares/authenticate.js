import jwt from 'jsonwebtoken';
import config from '../config/hidden/config';

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Failed to authenticate' });
      } else {
        console.log(decoded);
        req.id = decoded.id;
        req.deptId = decoded.deptId;
        req.isAdmin = decoded.isAdmin;
        next();
      }
    });
  } else {
    res.status(403).json({
      error: 'No token provided'
    });
  }
}