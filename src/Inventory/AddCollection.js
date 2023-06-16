import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { enqueueSnackbar } from "notistack";
import addNewCollection from "../services/addNewCollection";

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

export default function AddCollection(props) {
  const { edit, collection, handleUpdate, getCollectionList } = props;
  const classes = useStyles();

  const [collectionData, setCollectionData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleChangeTitle = (event) => {
    if (event.target.value.length <= 50) {
      setCollectionData({ ...collectionData, title: event.target.value });
    }
  };

  const handleChangeDescription = (event) => {
    if (event.target.value.length <= 100) {
      setCollectionData({ ...collectionData, description: event.target.value });
    }
  };

  const addCollection = async () => {
    if (collectionData.title.length > 2) {
      const response = await addNewCollection({
        ...collectionData,
        link: collectionData.title.split(" ").join("-"),
      });
      enqueueSnackbar(response.message, {
        variant: response.success ? "success" : "error",
      });
      if (response.success) {
        getCollectionList();
      }
    } else {
      enqueueSnackbar(
        "Collection length should be greater or equal 3 character",
        {
          variant: "error",
        }
      );
    }
  };

  const handleUpdateCollection = () => {
    handleUpdate({
      ...collection,
      ...collectionData,
      link: collectionData.title.split(" ").join("-"),
    });
  };

  useEffect(() => {
    if (edit) {
      setCollectionData({
        title: collection.title,
        description: collection.description,
        link: collection.link,
      });
    }
  }, [edit]);

  return (
    <div style={{ maxWidth: "80vw", minWidth: "400px" }}>
      <Typography variant="h5" className={classes.title}>
        Add New Collection
      </Typography>
      <TextField
        id="collection-title"
        label="Collection Title"
        margin="normal"
        variant="outlined"
        fullWidth
        value={collectionData.title}
        name="collection-title"
        onChange={handleChangeTitle}
      />
      <TextField
        id="collection-description"
        label="Collection Description"
        margin="normal"
        variant="outlined"
        fullWidth
        value={collectionData.description}
        name="collection-description"
        onChange={handleChangeDescription}
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
            onClick={addCollection}
          >
            Add
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleUpdateCollection}
          >
            Update
          </Button>
        )}
      </Box>
    </div>
  );
}
