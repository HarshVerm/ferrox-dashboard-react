import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  makeStyles,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@material-ui/core";
import { enqueueSnackbar } from "notistack";

import Basics from "./Form/Basics";
import Media from "./Form/Media";
import addNewProducts from "../services/addNewProduct";
import updateProduct from "../services/updateProduct";
import { CustomButton } from "../Common/CustomButton";

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

function getSteps() {
  return ["Basics", "Media"];
}

export default function CreateProductForm(props) {
  const { edit, editableProduct, getProductList } = props;
  const classes = useStyles();

  const [product, setProduct] = React.useState({
    title: "",
    category: "",
    description: "",
    collection: "",
    highlights: "",
    currency: "INR",
    mrpPrice: 1,
    sellingPrice: 1,
    returnAndExchange: false,
    categoryId: "",
    collectionId: "",
    isFeatured: false,
    isFeaturedId: null,
    color: "No Color"

  });

  const [images, setImages] = useState({
    0: {
      data: null,
      extension: null,
    },
    1: {
      data: null,
      extension: null,
    },
    2: {
      data: null,
      extension: null,
    },
    3: {
      data: null,
      extension: null,
    },
    4: {
      data: null,
      extension: null,
    },
    5: {
      data: null,
      extension: null,
    },
    6: {
      data: null,
      extension: null,
    },
    7: {
      data: null,
      extension: null,
    },
    8: {
      data: null,
      extension: null,
    },
    9: {
      data: null,
      extension: null,
    },
  });
  const [stock, setStock] = useState({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [loading, setLoading] = useState(false);

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <Basics
            setProduct={setProduct}
            product={product}
            setStock={setStock}
            stock={stock}
          />
        );
      case 1:
        return <Media images={images} setImages={setImages} />;
      default:
        return "Uknown stepIndex";
    }
  }

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAddProduct = async () => {
    setLoading(true);
    const filterImages = Object.keys(images)
      .map((key) => {
        if (images[key].data !== null) {
          return images[key];
        }
        return false;
      })
      .filter((image) => image);

    if (filterImages.length > 2) {
      let data = {
        variation: filterImages,
        categoryId: product.categoryId,
        category: product.category,
        collection: product.collection,
        collectionId: product.collectionId,
        title: product.title,
        color: product.color !== 'No Color' ? [product.color] : null,
        mrpPrice: { currency: product.currency, value: product.mrpPrice },
        sellingPrice: { currency: product.currency, value: product.sellingPrice },
        description: product.description,
        inStock: stock,
        highlights: product.highlights,
        returnAndExchange: {
          accepted: product.returnAndExchange,
          message: "Hassle-free returns and exchanges.",
          window: "30 days",
          windowMessage: "Return or exchange within 30 days of purchase.",
        },
      };
      const response = await addNewProducts(data);
      enqueueSnackbar(response.message, {
        variant: response.success ? "success" : "error",
      });
      if (response.success) {
        getProductList();
      }
    } else {
      enqueueSnackbar("Add atleast 3 images", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    const filterImages = Object.keys(images)
      .map((key) => {
        if (images[key].data !== null) {
          return images[key];
        }
        return false;
      })
      .filter((image) => image);

    if (filterImages.length > 2) {
      let data = {
        productId: editableProduct.productId,
        images: filterImages,
        categoryId: product.categoryId,
        category: product.category,
        collection: product.collection,
        collectionId: product.collectionId,
        title: product.title,
        isFeatured: product.isFeatured,
        isFeaturedId: product.isFeaturedId,
        mrpPrice: {
          currency: product.currency,
          value: product.mrpPrice >= 0 ? product.mrpPrice : 0,
        },
        sellingPrice: {
          currency: product.currency,
          value: product.sellingPrice >= 0 ? product.sellingPrice : 0
        },
        description: product.description,
        inStock: stock,
        highlights: product.highlights,
        returnAndExchange: {
          accepted: product.returnAndExchange,
          message: "Hassle-free returns and exchanges.",
          window: "30 days",
          windowMessage: "Return or exchange within 30 days of purchase.",
        },
      };
      const response = await updateProduct(data);
      enqueueSnackbar(response.message, {
        variant: response.success ? "success" : "error",
      });
      if (response.success) {
        getProductList();
      }
    } else {
      enqueueSnackbar("Add atleast 3 images", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (edit) {
      setProduct({
        title: editableProduct.title,
        category: editableProduct.category,
        description: editableProduct.description,
        collection: editableProduct.collection,
        highlights: editableProduct.highlights,
        currency: editableProduct.mrpPrice.currency,
        mrpPrice: editableProduct.mrpPrice.value,
        sellingPrice: editableProduct.sellingPrice.value,
        returnAndExchange: editableProduct.returnAndExchange.accepted,
        categoryId: editableProduct.categoryId,
        collectionId: editableProduct.collectionId,
        isFeatured: editableProduct.isFeatured ? true : false,
      });
      setStock({ ...editableProduct.inStock });
      editableProduct.images.forEach((item, index) => {
        setImages((prevState) => {
          return { ...prevState, [index]: { data: item, extension: null } };
        });
      });
    }
  }, [edit]);

  return (
    <Box>
      <Container maxWidth="lg" className={classes.root}>
        <div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <Box className={classes.content}>{getStepContent(activeStep)}</Box>
      </Container>
      <Grid
        container
        style={{
          marginTop: "1em",
          backgroundColor: "#fff",
        }}
      >
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={props.handleClose}
          >
            Quit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            {activeStep > 0 ? (
              <Button
                color="primary"
                className={classes.button}
                style={{ marginRight: "1em" }}
                onClick={handleBack}
              >
                Back
              </Button>
            ) : null}
            {activeStep === steps.length - 1 ? (
              <>
                {!edit ? (
                  <CustomButton
                    loading={loading}
                    onClick={handleAddProduct}
                    label="Add"
                  />
                ) : (
                  <CustomButton
                    loading={loading}
                    onClick={handleUpdateProduct}
                    label="Update"
                  />
                )}
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
