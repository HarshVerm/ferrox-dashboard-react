import React from "react";
import {
  makeStyles,
  Grid,
  Box,
  Typography,
  IconButton,
} from "@material-ui/core";
import fileToBase64 from "../../utils/fileToBase64";
import "./styles.css";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "ApercuMedium",
  },
  formControl: {
    minWidth: 120,
    marginTop: theme.spacing(2),
  },
  box: {
    overflow: "scroll",
  },
}));

export default function Media(props) {
  const { images, setImages } = props;
  const classes = useStyles();

  const handleImageChange = (event) => {
    event.persist();
    const file = event.target.files[0];
    const filePromise = fileToBase64(file);
    const extension = file.name.split(".")[1]

    Promise.resolve(filePromise).then((base64Images) => {
      setImages((prevState) => {
        return { ...prevState, [event.target.name]: {data:base64Images.result,extension,id:null} };
      });
    });
  };

  const removeImage =(key)=>{
    setImages((prevState) => {
      return { ...prevState, [key]: {data:null,extension:null,id:null} };
    });
  }

  return (
    <Grid container className={classes.grid} spacing={3}>
      <Grid item className={classes.box} xs={12} sm={12} md={12} lg={12}>
        <Box>
          <Typography variant="h5" className={classes.title} gutterBottom>
            Add Product Images
          </Typography>
        </Box>
      </Grid>

      <Grid
        item
        container
        className={classes.box}
        xs={12}
        sm={12}
        md={12}
        lg={12}
        spacing={2}
      >
        {Object.keys(images).length > 0 &&
          Object.keys(images).map((key, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
              <div className="upload-container">
                {!images[key].data ? (
                  <>
                    <input
                      type="file"
                      id={key}
                      accept="image/*"
                      onChange={handleImageChange}
                      name={key}
                    />
                    <label htmlFor={key} className="upload-button">
                      <div>
                        <AddCircleOutlinedIcon style={{fontSize:"80px"}}/>
                      </div>
                    </label>
                  </>
                ) : (
                  <div>
                    <div style={{ position: "absolute", right: 0 }}>
                      <IconButton style={{color:"black"}} onClick={()=>removeImage(key)}>
                        <CancelIcon style={{fontSize:"35px"}} />
                      </IconButton>
                    </div>
                    <img
                      src={images[key].data}
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
          ))}
      </Grid>
    </Grid>
  );
}
