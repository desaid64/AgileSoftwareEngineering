import React from 'react'
import moment from 'moment';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import ConfigForm from './ConfigForm.component'

const theme = createMuiTheme({
  typography: {
    fontSize: 22,
  }
})

const RulesConfigPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigForm />
    </ThemeProvider >
  );
};

export default RulesConfigPage