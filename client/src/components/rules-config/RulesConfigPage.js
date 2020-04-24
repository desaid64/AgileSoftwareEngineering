import React, { useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import ConfigForm from './ConfigForm.component'

import { FormControl } from '@material-ui/core';
import { useEffect } from 'react';


const theme = createMuiTheme({
  typography: {
    fontSize: 24,
  }
})

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '35%'
  },
  select: {
    textAlign: 'center'
  }
}))

const RulesConfigPage = (user) => {
  // user mapped to props from redux store. will contain department number and name
  // using hard coded until api route is updated
  const classes = useStyles()
  const [selectedDept, setSelectedDept] = useState(user.deptId)
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/departments')
      .then(response => {
        setDepartments(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(true)
        console.log(error);
      })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box display='flex' justifyContent="center" m={3}>
          {
            user.isAdmin && departments ?
              <FormControl className={classes.formControl}>
                <Select
                  MenuProps={{ variant: 'menu', PaperProps: { style: { height: '50vh' } } }}
                  className={classes.select}
                  variant="outlined"
                  value={`${selectedDept}`}
                  onChange={e => setSelectedDept(e.target.value)}
                >{
                    departments.map(department =>
                      <MenuItem
                        key={department.DepartmentID}
                        value={department.DepartmentID}
                      >
                        {department.DepartmentName}
                      </MenuItem>)
                  }
                </Select>
              </FormControl>
              :
              <h1>{isLoading ? false : departments[0].DepartmentName}</h1>
          }
        </Box>
        <ConfigForm department={selectedDept} isAdmin={user.isAdmin} />
      </Container>
    </ThemeProvider >
  );
};

const mapStateToProps = (state) => state.auth.user

export default connect(mapStateToProps)(RulesConfigPage)