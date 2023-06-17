import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  grid: {
    flexGrow: 1,
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  root: {
    width: "80vw",
    maxHeight: "80vh",
    overflow: "scroll",
    position: "relative",
  },
  formControl: {
    minWidth: 120,
    marginTop: theme.spacing(2),
  },
  button: {
    boxShadow: "none",
  },
  content: {
    minHeight: 400,
  },
}));

export const CustomButton = ({loading,onClick,label}) => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      onClick={onClick}
      disabled ={loading}
    >
     {loading ? <CircularProgress /> : label}
    </Button>
  );
};
