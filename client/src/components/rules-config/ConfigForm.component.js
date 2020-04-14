import React, { useState, Fragment } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import axios from 'axios'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import FilledInput from '@material-ui/core/FilledInput'

import defaultRules from '../../data/default-rules'
import timezones from '../../data/timezones'
import useStyles from './CofigForm.styles'

const cookies = {
  user: {
    isAdmin: false,
    dept_id: 123123
  }
}

const ConfigForm = (/* { user: { isAdmin, dept_id } } */) => {
  const INITIAL_STATE = {
    // variable range settings
    availableShiftResponseDeadline: defaultRules.availableShiftResponseDeadlineDefault,
    timePeriodAllowedForCallouts: defaultRules.timePeriodAllowedForCalloutsDefault,
    confirmCalloutTimePeriod: defaultRules.confirmCalloutTimePeriodDefault,
    minutesToWaitForMgrToAdvertise: defaultRules.minutesToWaitForMgrToAdvertiseDefault,
    // true / false settings
    shiftManagermunicationMethod: defaultRules.shiftManagermunicationMethodDefault,
    notifyMgrBeforeAdvertising: defaultRules.notifyMgrBeforeAdvertisingDefault,
    resolveNoMgrAdvertise: defaultRules.resolveNoMgrAdvertiseDefault,
    copyDeptMgrOnEmails: defaultRules.copyDeptMgrOnEmailsDefault,
    notifyMgrOfShiftResults: defaultRules.notifyMgrOfShiftResultsDefault
  }

  const [state, setState] = useState(() => {
    if (cookies.user.isAdmin) {
      var initialState = {
        ...INITIAL_STATE,
        systemTimeZone: "(GMT-05:00) Eastern Time",
        systemEmailAddress: 'sample@test.com'
      }
    }
    if (cookies.user.dept_id) {
      // get dept settings if they exist
    }
    return initialState ? initialState : INITIAL_STATE
  })
  const classes = useStyles();
  const SETTINGS = {
    INTERVAL_MIN: 0,
    INTERVAL_MAX: 60,
    DAY_MIN: 0,
    DAY_MAX: 7
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const request = {
      url: 'some url',
      method: 'post',
      params: {
        dept_id: cookies.user.dept_id,
        isAdmin: cookies.user.isAdmin
      },
      data: {
        availableShiftResponseDeadline: moment.duration({
          'minutes': state.availableShiftResponseDeadlineDefault
        }).asMilliseconds(),
        timePeriodAllowedForCallouts: moment.duration({
          'days': state.timePeriodAllowedForCalloutsDefault
        }).asMilliseconds(),
        confirmCalloutTimePeriod: moment.duration({
          'minutes': state.confirmCalloutTimePeriodDefault
        }).asMilliseconds(),
        minutesToWaitForMgrToAdvertise: moment.duration({
          'minutes': state.minutesToWaitForMgrToAdvertiseDefault
        }).asMilliseconds(),
        shiftManagermunicationMethod: state.shiftManagermunicationMethodDefault,
        notifyMgrBeforeAdvertising: state.notifyMgrBeforeAdvertisingDefault,
        resolveNoMgrAdvertise: state.resolveNoMgrAdvertiseDefault,
        copyDeptMgrOnEmails: state.copyDeptMgrOnEmailsDefault,
        notifyMgrOfShiftResults: state.notifyMgrOfShiftResultsDefault
      }
    }
    // axios request
  }

  const validateTime = (value) => {
    const pattern = /^$|^[0-5]?[0-9]$|^60$/
    return !!value.match(pattern)
  }

  const validateDay = (value) => {
    return !(value < SETTINGS.DAY_MIN || value > SETTINGS.DAY_MAX)
  }

  const handleOnChange = (setting, value) => {
    switch (setting) {
      case 'availableShiftResponseDeadline':
      case 'confirmCalloutTimePeriod':
      case 'minutesToWaitForMgrToAdvertise':
        if (validateTime(value)) {
          setState(prevState => (value === '' ? { ...prevState, [setting]: SETTINGS.INTERVAL_MIN } : { ...prevState, [setting]: value }))
        }
        break
      case 'timePeriodAllowedForCallouts':
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
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormGroup row>
          <FormControlLabel
            className={classes.controlLabel}
            control={
              <Switch
                onChange={event => setState(prevState => ({ ...prevState, shiftManagermunicationMethod: event.target.checked }))}
                checked={state.shiftManagermunicationMethod}
                value="shiftManagermunicationMethod"
              />
            }
            label="Use employee preferred communication method:"
            labelPlacement="start"
          />
          <FormControlLabel
            className={classes.controlLabel}
            control={
              <Switch
                onChange={event => setState(prevState => ({ ...prevState, notifyMgrBeforeAdvertising: event.target.checked }))}
                checked={state.notifyMgrBeforeAdvertising}
                value="notifyMgrBeforeAdvertising"
              />
            }
            label="Notify manager of call-out before advertising shift:"
            labelPlacement="start"
          />

          <FormControlLabel
            className={classes.controlLabel}
            control={
              <Switch
                onChange={event => setState(prevState => ({ ...prevState, resolveNoMgrAdvertise: event.target.checked }))}
                checked={state.resolveNoMgrAdvertise}
                value="resolveNoMgrAdvertise"
              />
            }
            label="Advertise shift if manager does not respond to call-out notification:"
            labelPlacement="start"
          />
          <FormControlLabel
            className={classes.controlLabel}
            control={
              <Switch
                onChange={event => setState(prevState => ({ ...prevState, copyDeptMgrOnEmails: event.target.checked }))}
                checked={state.copyDeptMgrOnEmails}
                value="copyDeptMgrOnEmails"
              />
            }
            label="CC manager on all employee system interactions:"
            labelPlacement="start"
          />
          <FormControlLabel
            className={classes.controlLabel}
            control={
              <Switch
                onChange={event => setState(prevState => ({ ...prevState, notifyMgrOfShiftResults: event.target.checked }))}
                checked={state.notifyMgrOfShiftResults}
                value="notifyMgrOfShiftResults"
              />
            }
            label="Use employee preferred communication method:"
            labelPlacement="start"
          />
        </FormGroup>
        <FormGroup className={classes.group}>
          {cookies.user.isAdmin ? (
            <Fragment>
              <FormControlLabel
                className={classes.controlLabel}
                label="System default time zone:"
                labelPlacement="start"
                control={
                  <FilledInput
                    className={classes.input}
                    value={state.systemTimeZone}
                    type='select'
                    margin="dense"
                  >
                    <li>item 1</li>
                    <li>item 2</li>
                    <li>item 3</li>
                    <li>item 4</li>
                  </FilledInput>
                }
              />
              <FormControlLabel
                className={classes.controlLabel}
                label="System e-mail address:"
                labelPlacement="start"
                control={
                  <FilledInput
                    className={classes.input}
                    value={state.systemEmailAddress}
                    type='text'
                    margin="dense"
                  />
                }
              />
            </Fragment>
          ) : false}
          <FormControlLabel
            className={classes.controlLabel}
            control={
              <FilledInput
                className={classes.input}
                value={state.availableShiftResponseDeadline}
                type="number"
                inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                margin="dense"
                onChange={event => handleOnChange('availableShiftResponseDeadline', event.target.value)}
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
                value={state.timePeriodAllowedForCallouts}
                type="number"
                inputProps={{ min: SETTINGS.DAY_MIN, max: SETTINGS.DAY_MAX }}
                margin="dense"
                onChange={event => handleOnChange('timePeriodAllowedForCallouts', event.target.value)}
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
                value={state.confirmCalloutTimePeriod}
                type="number"
                inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                margin="dense"
                onChange={event => handleOnChange('confirmCalloutTimePeriod', event.target.value)}
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
                value={state.minutesToWaitForMgrToAdvertise}
                type="number"
                inputProps={{ min: SETTINGS.INTERVAL_MIN, max: SETTINGS.INTERVAL_MAX }}
                margin="dense"
                onChange={event => handleOnChange('minutesToWaitForMgrToAdvertise', event.target.value)}
              />
            }
            label={<p>Minutes to wait for manager to advertise shift:<br /></p>}
            labelPlacement="start"
          />
        </FormGroup>
        <Button className={classes.submitButton} variant="contained" type="submit" color="primary">Submit</Button>
      </form>
    </div>
  )
}

ConfigForm.propTypes = {
  user: PropTypes.object.isRequired
}

export default ConfigForm