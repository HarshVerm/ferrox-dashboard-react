import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { enqueueSnackbar } from "notistack";
import { FormControl, Grid, MenuItem, Select } from "@material-ui/core";
import addLandingPageItems from "../services/addLandingPageItems";
import fileToBase64 from "../utils/fileToBase64";
import { CustomButton } from "../Common/CustomButton";

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
  const { productId, productName ,getProductList} = props;
  const classes = useStyles();

  const [featured, setFeaturedData] = useState({
    productId: "",
    mode: "IMAGE",
    primaryDesktopImage: {
      data: null,
      extension: null,
    },
    primaryDesktopVideo: {
      data: null,
      extension: null,
    },
    primaryMobileImage: {
      data: null,
      extension: null,
    },
    primaryMobileVideo: {
      data: null,
      extension: null,
    },
    webFileName: null,
    mobileFileName: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFile = async (event) => {
    event.persist();
    const file = event.target.files[0];
    const extension = file.name.split(".")[1];

    if (featured.mode === "IMAGE") {
      const filePromise = fileToBase64(file);
      const res = await Promise.resolve(filePromise);
      return { extension, fileName: file.name, data: res.result };
    }

    return { extension, fileName: file.name, data: null };
  };

  const handleChange = (event) => {
    setFeaturedData((prevState) => {
      return {
        ...prevState,
        mode: event.target.value,
        primaryDesktopImage: {
          data: null,
          extension: null,
        },
        primaryDesktopVideo: {
          data: null,
          extension: null,
        },
        primaryMobileImage: {
          data: null,
          extension: null,
        },
        primaryMobileVideo: {
          data: null,
          extension: null,
        },
        webFileName: null,
        mobileFileName: null,
      };
    });
  };

  const handleChangeForWeb = async (event) => {
    event.persist();
    const res = await handleFile(event);
    console.log(res);
    if (featured.mode === "IMAGE") {
      setFeaturedData((prevState) => {
        return {
          ...prevState,
          primaryDesktopImage: {
            data: res.data,
            extension: res.extension,
          },
          webFileName: res.fileName,
        };
      });
    } else {
      setFeaturedData((prevState) => {
        return {
          ...prevState,
          primaryDesktopVideo: {
            data: event.target.files[0],
            extension: res.extension,
          },
          webFileName: res.fileName,
        };
      });
    }
  };

  const handleChangeForMobile = async (event) => {
    event.persist();
    const res = await handleFile(event);
    if (featured.mode === "IMAGE") {
      setFeaturedData((prevState) => {
        return {
          ...prevState,
          primaryMobileImage: {
            data: res.data,
            extension: res.extension,
          },
          mobileFileName: res.fileName,
        };
      });
    } else {
      setFeaturedData((prevState) => {
        return {
          ...prevState,
          primaryMobileVideo: {
            data: event.target.files[0],
            extension: res.extension,
          },
          mobileFileName: res.fileName,
        };
      });
    }
  };

  const handleAddFeaturedProd = async () => {
    setLoading(true);
    if (
      (featured.primaryDesktopImage.data ||
        featured.primaryDesktopVideo.data) &&
      (featured.primaryMobileImage.data || featured.primaryMobileVideo.data)
    ) {
      const data = {
        primaryImageWeb: featured.primaryDesktopImage,
        primaryImageMobile: featured.primaryMobileImage,
        primaryVideoWeb: featured.primaryDesktopVideo,
        primaryVideoMobile: featured.primaryMobileVideo,
        mode: featured.mode,
        productId: featured.productId,
      };

      const res = await addLandingPageItems(data);
      console.log(res);
      enqueueSnackbar(res.message, {
        variant: res.success ? "success" : "error",
      });
      if(res.success){
        getProductList()
      }
    } else {
      enqueueSnackbar("Please add file for web and mobile.", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setFeaturedData((prevState) => {
      return { ...prevState, productId: productId };
    });
  }, [productId]);

  return (
    <div style={{ maxWidth: "60vw", minWidth: "400px" }}>
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
                name: "mode",
                id: "outlined-mode-simple",
              }}
              name="mode"
              onChange={handleChange}
            >
              <MenuItem value="IMAGE">IMAGE</MenuItem>
              <MenuItem value="VIDEO">VIDEO</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm={2} md={2} lg={2}>
          <Typography variant="subtitle1" style={{ lineHeight: 3 }}>
            Web Version :
          </Typography>
        </Grid>
        <Grid item xs={9} sm={9} md={9} lg={9}>
          <div className="upload-container">
            <input
              type="file"
              id="forWeb"
              accept={featured.mode === "IMAGE" ? "image/*" : "video/mp4"}
              onChange={handleChangeForWeb}
              name="forWeb"
              className="inputFile"
            />
            <label htmlFor="forWeb" className="upload-file">
              <div>Upload File</div>
              <span style={{ lineHeight: 2.5, padding: "0 10px" }}>
                {featured.webFileName}
              </span>
            </label>
          </div>
        </Grid>
        <Grid item xs={3} sm={2} md={2} lg={2}>
          <Typography variant="subtitle1" style={{ lineHeight: 3 }}>
            Mobile Version :
          </Typography>
        </Grid>
        <Grid item xs={9} sm={9} md={9} lg={9}>
          <div className="upload-container">
            <input
              type="file"
              id="forMobile"
              accept={featured.mode === "IMAGE" ? "image/*" : "video/mp4"}
              onChange={handleChangeForMobile}
              name="forMobile"
              className="inputFile"
            />
            <label htmlFor="forMobile" className="upload-file">
              <div>Upload File</div>
              <span style={{ lineHeight: 2.5, padding: "0 10px" }}>
                {featured.mobileFileName}
              </span>
            </label>
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
        <CustomButton
          onClick={handleAddFeaturedProd}
          loading={loading}
          label="Add"
        />
      </Box>
    </div>
  );
}
