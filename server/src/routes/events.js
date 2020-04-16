import express from 'express';
//import authenticate from '../middlewares/authenticate';
import authenticate from '../middlewares/adminAuthenticate';
let router = express.Router();

router.post('/', authenticate, (req, res) => {
  res.status(201).json({id: req.id, deptId: req.deptId});
});

export default router;