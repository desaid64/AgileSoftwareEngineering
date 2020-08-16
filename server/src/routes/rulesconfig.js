import express from 'express';
const router = express.Router();

const { body, validationResult } = require('express-validator')

const db = require("../config/db.js");
import authenticate from '../middlewares/authenticate'


router.get('/', authenticate, (req, res) => {
  const DepartmentID = req.isAdmin ? req.query.DepartmentID : req.deptId
  const sql = 'call getDepartmentRules(?)';
  db.query(sql, [DepartmentID], (err, [[rules]]) => {
    if (err) return res.json(err);
    if (req.isAdmin) {
      const sql2 = 'call getSystemSettings(?)'
      db.query(sql2, [DepartmentID], (err, [[settings]]) => {
        if (err) return res.json(err)
        console.log(settings)
        res.json({ ...rules, ...settings })
      })
    } else {
      res.json(rules);
    }
  });
})

router.post('/', authenticate, [
  body([
    'ShiftManagerComunicationMethod',
    'NotifyMgrBeforeAdvertising',
    'ResolveNoMgrAdvertise',
    'CopyDeptMgrOnEmails',
    'ResolveNoMgrFinalDecision',
    'NotifyMgrOfShiftResults']).isBoolean(),
  body([
    'AvailableShiftResponseDeadline',
    'ConfirmCalloutTimePeriod',
    'MinutesToWaitForMgrToAdvertise',
    'MinutesToWaitForMgrFinalDecision',
    'TimePeriodAllowedForCallOuts'
  ]).isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() })
  }
  const DepartmentID = req.isAdmin ? req.body.DepartmentID : req.deptId
  const ShiftManagerComunicationMethod = req.body.ShiftManagerComunicationMethod ? 1 : 0
  const NotifyMgrBeforeAdvertising = req.body.NotifyMgrBeforeAdvertising ? 1 : 0
  const ResolveNoMgrAdvertise = req.body.ResolveNoMgrAdvertise ? 1 : 0
  const CopyDeptMgrOnEmails = req.body.CopyDeptMgrOnEmails ? 1 : 0
  const ResolveNoMgrFinalDecision = req.body.ResolveNoMgrFinalDecision ? 1 : 0
  const NotifyMgrOfShiftResults = req.body.NotifyMgrOfShiftResults ? 1 : 0


  const {
    AvailableShiftResponseDeadline,
    ConfirmCalloutTimePeriod,
    MinutesToWaitForMgrToAdvertise,
    MinutesToWaitForMgrFinalDecision,
    TimePeriodAllowedForCallOuts,
    SystemEmailAddress,
    SystemTimeZone
  } = req.body

  const sql = 'call setDepartmentRules(?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(sql, [
    DepartmentID,
    AvailableShiftResponseDeadline,
    TimePeriodAllowedForCallOuts,
    ConfirmCalloutTimePeriod,
    ResolveNoMgrAdvertise,
    CopyDeptMgrOnEmails,
    NotifyMgrOfShiftResults,
    ShiftManagerComunicationMethod,
    NotifyMgrBeforeAdvertising,
    MinutesToWaitForMgrToAdvertise,
    MinutesToWaitForMgrFinalDecision,
    ResolveNoMgrFinalDecision
  ],
    (err, [[rules]]) => {
      if (err) return res.json({ error: err.stack });
      if (req.isAdmin) {
        const sql2 = 'call setSystemSettings(?,?)'
        console.log(SystemEmailAddress + SystemTimeZone);
        db.query(sql2, [SystemTimeZone, SystemEmailAddress], (err, [[settings]]) => {
          if (err) return res.json({ error: err.stack });
          res.json({ rules, settings })
        })
      } else {
        res.json(rules)
      }
    });
})

export default router