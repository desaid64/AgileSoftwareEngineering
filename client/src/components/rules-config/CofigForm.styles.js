import { makeStyles } from '@material-ui/core/styles'

export default makeStyles({
  root: {
    display: "grid",
    justifyItems: "center"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridColumnGap: "30px",
    gridRowGap: "20px",
    width: "100%",
    justifyContent: "center",
    boxSizing: "border-box"
  },
  controlLabel: {
    width: "90%",
    justifyContent: "space-between"
  },
  input: {
    width: "auto"
  },
  submitButton: {
    marginTop: '25px',
    width: "100px",
    justifySelf: "end"
  },
  group: {
    justifyContent: "space-between"
  }
})