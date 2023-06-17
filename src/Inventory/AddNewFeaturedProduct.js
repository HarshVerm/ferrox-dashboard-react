import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";
import { enqueueSnackbar } from "notistack";
import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
} from "@material-ui/core";
import fileToBase64 from "../utils/fileToBase64";

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

export default function AddNewFeaturedProduct(props) {
  const { productId, productName } = props;
  const classes = useStyles();

  const [featured, setFeaturedData] = useState({
    productId: "",
    mode: "IMAGE",
    primaryImage: null,
    primaryVideo: null,
    extension: null,
  });

  const handleAddPrimaryImage = (event) => {
    event.persist();
    const file = event.target.files[0];
    const filePromise = fileToBase64(file);
    const extension = file.name.split(".")[1];
    Promise.resolve(filePromise).then((base64Images) => {
      setFeaturedData((prevState) => {
        return {
          ...prevState,
          primaryImage: base64Images.result,
          extension:extension
        };
      });
    });
  };

  const handleChange = (event) => {
    setFeaturedData((prevState) => {
      return {
        ...prevState,
        mode: event.target.value,
        primaryImage: null,
        primaryVideo: null,
        extension: null,
      };
    });
  };

  useEffect(() => {
    setFeaturedData(prevState=>{return{...prevState, productId:productId}})
  }, [productId]);

  return (
    <div style={{ maxWidth: "80vw", minWidth: "400px" }}>
      <Typography variant="h5" className={classes.title}>
        Featured Product
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={4} md={4} lg={4}>
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            Product Id :
          </Typography>
        </Grid>
        <Grid item xs={6} sm={8} md={8} lg={8}>
          <Typography variant="subtitle1">{featured.productId}</Typography>
        </Grid>
        <Grid item xs={6} sm={4} md={4} lg={4}>
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            Product Name :
          </Typography>
        </Grid>
        <Grid item xs={6} sm={8} md={8} lg={8}>
          <Typography variant="subtitle1">{productName}</Typography>
        </Grid>
        <Grid item xs={3} sm={2} md={2} lg={2}>
          <Typography variant="subtitle1" style={{ lineHeight: 3 }}>
            Mode :
          </Typography>
        </Grid>
        <Grid item xs={9} sm={10} md={10} lg={10}>
          <FormControl
            variant="outlined"
            className={classes.formControl}
            fullWidth
          >
            <Select
              value={featured.mode}
              labelWidth={0}
              inputProps={{
                name: "category",
                id: "outlined-category-simple",
              }}
              name="category"
              onChange={handleChange}
            >
              <MenuItem value="IMAGE">IMAGE</MenuItem>
              <MenuItem value="VIDEO">VIDEO</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="upload-container">
            {featured.mode === "IMAGE" && !featured.primaryImage ? (
              <>
                <input
                  type="file"
                  id="primaryImage"
                  accept="image/*"
                  onChange={handleAddPrimaryImage}
                  name="primaryImage"
                />
                <label htmlFor="primaryImage" className="upload-button">
                  <div>
                    <AddCircleOutlinedIcon style={{ fontSize: "80px" }} />
                  </div>
                </label>
              </>
            ) : (
              <div>
                <div style={{ position: "absolute", right: 0 }}>
                  <IconButton style={{ color: "black" }}>
                    <CancelIcon style={{ fontSize: "35px" }} />
                  </IconButton>
                </div>
                <img
                  src={featured.primaryImage}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </div>
        </Grid>
      </Grid>

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
        <Button variant="contained" color="primary" className={classes.button}>
          Add
        </Button>
      </Box>
    </div>
  );
}
