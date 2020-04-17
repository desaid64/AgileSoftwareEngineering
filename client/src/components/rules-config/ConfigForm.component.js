import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import FilledInput from '@material-ui/core/FilledInput'
import Box from '@material-ui/core/Box'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'

import timezones from '../../data/timezones'
import useStyles from './CofigForm.styles'

const SETTINGS = {
  INTERVAL_MIN: 0,
  INTERVAL_MAX: 60,
  DAY_MIN: 0,
  DAY_MAX: 7
}

const validateTime = (value) => {
  const pattern = /^$|^[0-5]?[0-9]$|^60$/
  return !!value.match(pattern)
}

const validateDay = (value) => {
  return !(value < SETTINGS.DAY_MIN || value > SETTINGS.DAY_MAX)
}

const ConfigForm = ({ department, isAdmin }) => {
  const classes = useStyles()

  const [state, setState] = useState({
    ShiftManagerComunicationMethod: false,
    NotifyMgrBeforeAdvertising: false,
    ResolveNoMgrAdvertise: false,
    CopyDeptMgrOnEmails: false,
    ResolveNoMgrFinalDecision: false,
    NotifyMgrOfShiftResults: false,

    AvailableShiftResponseDeadline: 0,
    ConfirmCalloutTimePeriod: 0,
    MinutesToWaitForMgrToAdvertise: 0,
    MinutesToWaitForMgrFinalDecision: 0,
    TimePeriodAllowedForCallOuts: 0,

    SystemEmailAddress: '',
    SystemTimeZone: ''
  })

  useEffect(() => {
    console.log('config form mounted!');
    console.log(department);
    axios.get('/api/rulesconfig', { params: { DepartmentID: department } })
      .then(response => {
        console.log(response.data);
        setState({
          // system level admin rules
          ...response.data,
          // boolean value rules
          ShiftManagerComunicationMethod: !!response.data.ShiftManagerComunicationMethod,
          NotifyMgrBeforeAdvertising: !!response.data.NotifyMgrBeforeAdvertising,
          ResolveNoMgrAdvertise: !!response.data.ResolveNoMgrAdvertise,
          CopyDeptMgrOnEmails: !!response.data.CopyDeptMgrOnEmails,
          ResolveNoMgrFinalDecision: !!response.data.ResolveNoMgrFinalDecision,
          NotifyMgrOfShiftResults: !!response.data.NotifyMgrOfShiftResults,
          // numeric value rules
          AvailableShiftResponseDeadline: +response.data.AvailableShiftResponseDeadline,
          ConfirmCalloutTimePeriod: +response.data.ConfirmCalloutTimePeriod,
          MinutesToWaitForMgrToAdvertise: +response.data.MinutesToWaitForMgrToAdvertise,
          MinutesToWaitForMgrFinalDecision: +response.data.MinutesToWaitForMgrFinalDecision,
          TimePeriodAllowedForCallOuts: +response.data.TimePeriodAllowedForCallOuts,

        })
      })
  }, [department])

  const handleOnChange = (setting, value) => {
    switch (setting) {
      case 'ShiftManagerComunicationMethod':
      case 'NotifyMgrBeforeAdvertising':
      case 'ResolveNoMgrAdvertise':
      case 'ResolveNoMgrFinalDecision':
      case 'CopyDeptMgrOnEmails':
      case 'NotifyMgrOfShiftResults':
      case 'SystemEmailAddress':
      case 'SystemTimeZone':
        setState(prevState => ({ ...prevState, [setting]: value }))
        break
      case 'AvailableShiftResponseDeadline':
      case 'ConfirmCalloutTimePeriod':
      case 'MinutesToWaitForMgrToAdvertise':
      case 'MinutesToWaitForMgrFinalDecision':
        if (validateTime(value)) {
          setState(prevState => (value === '' ? { ...prevState, [setting]: SETTINGS.INTERVAL_MIN } : { ...prevState, [setting]: value }))
        }
        break
      case 'TimePeriodAllowedForCallOuts':
        if (validateDay(value)) {
          setState(prevState => (value === '' ? { ...prevState, [setting]: SETTINGS.DAY_MIN } : { ...prevState, [setting]: value }))
        }
        break
      default:
        return false
    }
  }

  return (
    <div className={classes.root}>
      <Box boxShadow={2} p={2}>
        <form>
          {isAdmin ? (
            <Fragment>
              <FormControlLabel
                className={classes.controlLabel}
                label="System default time zone:"
                labelPlacement="start"
                control={
                  <Select
                    MenuProps={{ variant: 'menu', PaperProps: { style: { height: '50vh' } } }}
                    variant='filled'
                    value={state.SystemTimeZone}
                    onChange={event => handleOnChange('SystemTimeZone', event.target.value)}
                  >{
                      Object.entries(timezones).map(([key, value]) => <MenuItem key={key} value={key}>{key}</MenuItem>)
                    }
                  </Select>
                }
              />
              <FormControlLabel
                className={classes.controlLabel}
                label="System e-mail address:"
                labelPlacement="start"
                control={
                  <FilledInput
                    className={classes.input}
                    value={state.SystemEmailAddress}
                    type='text'
                    margin="dense"
                  />
                }
              />
              <Divider />
            </Fragment>
          ) : false}
          <FormGroup row>
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('ShiftManagerComunicationMethod', event.target.checked)}
              control={
                <Switch
                  checked={state.ShiftManagerComunicationMethod}
                  value="ShiftManagerComunicationMethod"
                />
              }
              label="Use employee preferred communication method:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('NotifyMgrBeforeAdvertising', event.target.checked)}
              control={
                <Switch
                  checked={state.NotifyMgrBeforeAdvertising}
                  value="NotifyMgrBeforeAdvertising"
                />
              }
              label="Notify manager of call-out before advertising shift:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('ResolveNoMgrAdvertise', event.target.checked)}
              control={
                <Switch
                  checked={state.ResolveNoMgrAdvertise}
                  value="ResolveNoMgrAdvertise"
                />
              }
              label="Advertise shift if manager does not respond to call-out notification:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('CopyDeptMgrOnEmails', event.target.checked)}
              control={
                <Switch
                  checked={state.CopyDeptMgrOnEmails}
                  value="CopyDeptMgrOnEmails"
                />
              }
              label="CC manager on all employee system interactions:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('NotifyMgrOfShiftResults', event.target.checked)} control={
                <Switch
                  checked={state.NotifyMgrOfShiftResults}
                  value="NotifyMgrOfShiftResults"
                />
              }
              label="Use employee preferred communication method:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              onChange={event => handleOnChange('ResolveNoMgrFinalDecision', event.target.checked)} control={
                <Switch
                  checked={state.ResolveNoMgrFinalDecision}
                  value="ResolveNoMgrFinalDecision"
                />
              }
              label="Proceed without manager final decision response:"
              labelPlacement="start"
            />
          </FormGroup>
          <Divider />
          <FormGroup className={classes.group}>
            <FormControlLabel
              className={classes.controlLabel}
              control={
                <FilledInput
                  className={classes.input}
                  value={state.AvailableShiftResponseDeadline}
                  type="number"
                  inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                  margin="dense"
                  onChange={event => handleOnChange('AvailableShiftResponseDeadline', event.target.value)}
                />
              }
              label="Minutes to wait for an available shift response:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              control={
                <FilledInput
                  className={classes.input}
                  value={state.TimePeriodAllowedForCallOuts}
                  type="number"
                  inputProps={{ min: SETTINGS.DAY_MIN, max: SETTINGS.DAY_MAX }}
                  margin="dense"
                  onChange={event => handleOnChange('TimePeriodAllowedForCallOuts', event.target.value)}
                />
              }
              label={<p>Number of days available for call-out:<br />(0 for next shift only)</p>}
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              control={
                <FilledInput
                  className={classes.input}
                  value={state.ConfirmCalloutTimePeriod}
                  type="number"
                  inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                  margin="dense"
                  onChange={event => handleOnChange('ConfirmCalloutTimePeriod', event.target.value)}
                />
              }
              label="Minutes to wait for employee to confirm their call-out:"
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              control={
                <FilledInput
                  className={classes.input}
                  value={state.MinutesToWaitForMgrToAdvertise}
                  type="number"
                  inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                  margin="dense"
                  onChange={event => handleOnChange('MinutesToWaitForMgrToAdvertise', event.target.value)}
                />
              }
              label={<p>Minutes to wait for manager to advertise shift:<br /></p>}
              labelPlacement="start"
            />
            <FormControlLabel
              className={classes.controlLabel}
              control={
                <FilledInput
                  className={classes.input}
                  value={state.MinutesToWaitForMgrFinalDecision}
                  type="number"
                  inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                  margin="dense"
                  onChange={event => handleOnChange('MinutesToWaitForMgrFinalDecision', event.target.value)}
                />
              }
              label={<p>Minutes to wait for manager to final decision:<br /></p>}
              labelPlacement="start"
            />
          </FormGroup>
        </form>
      </Box>
      <Button className={classes.submitButton} variant="contained" type="submit" color="primary">Submit</Button>
    </div>
  )
}

ConfigForm.propTypes = {
  department: PropTypes.number.isRequired
}

export default ConfigForm