import express, { response } from 'express';
import authenticate from '../middlewares/authenticate.js';
const router = express.Router();
const db = require("../config/db.js");

const endponts = {
  initiateCallout: "/initiate",
  waitForShiftSelection: "/shiftselect",
  waitForUserConfirm: "/userconfirm",
  waitForManagerConfirm: "/managerconfirm",
}

router.get('/initiate', (req, res) => {
  const { employee_id } = req.query
  console.log(employee_id);
  const sql1 = 'CALL getEmployeeDepartmentRules(?)'
  db.query(sql1, [employee_id], (error, [[rules]]) => {
    if (error) console.error(error.sqlMessage)
    const sql2 = 'CALL getShiftsAvailableForCallout(?,?)'
    db.query(sql2, [employee_id, rules.TimePeriodAllowedForCallOuts], (error, [results]) => {
      if (error) console.error(error.sqlMessage)
      if (results.length > 0) {
        res.status(200).json(results)
      } else {
        res.json({ error: "No shifts available for callout" })
      }
    })
  })
})

router.post('/shiftselect', async (req, res) => {
  const { employee_id } = req.query
  const { shifts } = req.body
  const shiftArray = await JSON.parse(shifts)
  const sql = 'CALL setShiftStatus(?,"Callout")'
  console.log(shifts);
  console.log(shiftArray);
  shiftArray.forEach(shift => {
    db.query(sql, [shift], (err, results) => {
      if (err) console.error(err.sqlMessage)
    })
  })
  res.json({ Message: `Calling out for shifts ${[...shiftArray]}` })
  /**
   * If the rule says you need to confirm the callout with a manager do it. 
   * otherwise set the status to "Available" and prodeed to try filling the shift 
   * */

})

export default router