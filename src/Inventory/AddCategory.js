import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import addNewCategory from "../services/addCategory";
import { enqueueSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    width: "375px",
  },
  typeField: {
    marginLeft: theme.spacing(1),
    width: "175px",
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  button: {
    boxShadow: "none",
  },
  title: {
    fontFamily: "ApercuMedium",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export default function AddCategory(props) {
  const classes = useStyles();
  const { edit, category, handleUpdate, getCategoryList } = props;
  const [categoryData, setCategoryData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleChangeCategoryTitle = (event) => {
    if (event.target.value.length < 50) {
      setCategoryData({ ...categoryData, title: event.target.value });
    }
  };

  const handleChangeCategoryDescription = (event) => {
    if (event.target.value.length < 100) {
      setCategoryData({ ...categoryData, description: event.target.value });
    }
  };

  const addCategory = async () => {
    if (categoryData.title.length > 2) {
      const response = await addNewCategory({
        ...categoryData,
        link: categoryData.title.split(" ").join("-"),
      });
      enqueueSnackbar(response.message, {
        variant: response.success ? "success" : "error",
      });
      if (response.success) {
        getCategoryList();
      }
    } else {
      enqueueSnackbar(
        "Category length should be greater or equal 3 character",
        {
          variant: "error",
        }
      );
    }
  };

  const handleUpdateCategory = () => {
    handleUpdate({
      ...category,
      ...categoryData,
      link: categoryData.title.split(" ").join("-"),
    });
  };

  useEffect(() => {
    if (edit) {
      setCategoryData({
        title: category.title,
        description: category.description,
        link: category.link,
      });
    }
  }, [edit]);

  return (
    <div style={{ maxWidth: "80vw", minWidth: "400px" }}>
      <Typography variant="h5" className={classes.title}>
        Add New Category
      </Typography>
      <TextField
        id="outlined-name"
        label="Category"
        margin="normal"
        variant="outlined"
        fullWidth
        value={categoryData.title}
        name="category"
        onChange={handleChangeCategoryTitle}
      />
      <TextField
        id="outlined-name"
        label="Category description"
        margin="normal"
        variant="outlined"
        fullWidth
        value={categoryData.description}
        name="category"
        onChange={handleChangeCategoryDescription}
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        style={{ marginTop: "2em" }}
      >
        <Button
          vsize="small"
          color="primary"
          className={classes.button}
          style={{ marginRight: 10 }}
          onClick={props.onClose}
        >
          Cancel
        </Button>
        {!edit ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={addCategory}
          >
            Add
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleUpdateCategory}
          >
            Update
          </Button>
        )}
      </Box>
    </div>
  );
}
