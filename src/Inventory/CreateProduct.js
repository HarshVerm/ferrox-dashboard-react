import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    boxShadow: "none",
    fontFamily: "ApercuMedium",
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

export default function CreateProduct(props) {
  const classes = useStyles();
  const { push } = useHistory()

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => push('/dashboard/add-new-product')}
      >
        Create New Product
        <AddIcon className={classes.rightIcon}>Create New Product</AddIcon>
      </Button>
    </React.Fragment>
  );
}
