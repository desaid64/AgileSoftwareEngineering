import { makeStyles } from '@material-ui/core/styles'

export default makeStyles({
  root: {
    display: "grid",
    placeItems: "center",
    height: '80vh'
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr",
    // gridColumnGap: "30px",
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
    marginTop: '12px',
    width: "100px",
    float: "right",
  },
  group: {
    justifyContent: "space-between"
  },
  loading: {
    display: 'block'
  },
  divider: {
    margin: "12px auto"
  }
})