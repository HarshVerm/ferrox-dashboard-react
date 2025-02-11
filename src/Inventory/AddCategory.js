import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import addNewCategory from "../services/addCategory";
import { enqueueSnackbar } from "notistack";
import { CustomButton } from "../Common/CustomButton";
import { uuidv4 } from "../utils/uuid";

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
    id: uuidv4(),
    title: "",
    description: "",
    link: "",
  });
  const [subCategories, setSubCategories] = useState({})
  const [loading, setLoading] = useState(false);

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

  function isSubCategoriesOk() {
    if (Object.keys(subCategories).length === 0) {
      return { category: categoryData, subCategories: [] }
    } else {
      const cats = []
      Object.keys(subCategories).forEach((cat) => {
        if (subCategories[cat].title && subCategories[cat].title.trim().length !== 0) {
          cats.push({ ...subCategories[cat], parentCatId: categoryData.id, parentCatName: categoryData.title })
        }
      })
      return { category: categoryData, subCategories: cats }
    }
  }

  const addCategory = async () => {
    setLoading(true);
    if (categoryData.title.length > 2) {
      const catData = isSubCategoriesOk()
      const response = await addNewCategory({ ...catData, category: { ...catData.category, link: categoryData.title.split(" ").join("-"), enabled: true } });
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
    setLoading(false);
  };

  const handleUpdateCategory = async () => {
    setLoading(true);
    await handleUpdate({
      ...category,
      ...categoryData,
      link: categoryData.title.split(" ").join("-"),
    });
    setLoading(false);
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

  function addSubCategory() {
    const newArr = { ...subCategories, [uuidv4()]: { title: '', id: uuidv4() } }
    setSubCategories(newArr)
  }

  function handleChangeSubcat(e) {
    const catObj = subCategories[e.target.name]
    const newCats = { ...subCategories, [e.target.name]: { ...catObj, title: e.target.value } }
    setSubCategories(newCats)
  }


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
      {Object.keys(subCategories).map((key) => {
        return (
          <TextField
            key={key}
            id="outlined-name"
            label={`cat-${key}`}
            margin="normal"
            variant="outlined"
            fullWidth
            value={subCategories[key].title}
            name={key}
            onChange={handleChangeSubcat}
          />
        )
      })}

      <Button variant="outlined" onClick={addSubCategory}>
        Add Subcategory
      </Button>


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
          <CustomButton loading={loading} onClick={addCategory} label="Add" />
        ) : (
          <CustomButton loading={loading} onClick={handleUpdateCategory} label="Update" />
        )}
      </Box>
    </div>
  );
}
