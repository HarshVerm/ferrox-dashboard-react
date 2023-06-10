import React, { useState } from "react";
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
import { enqueueSnackbar } from 'notistack'

import Basics from "./Form/Basics";
import Media from "./Form/Media";
import addNewProducts from "../services/addNewProduct";

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
  const classes = useStyles();

  const [product, setProduct] = React.useState({
    title: "",
    category: "",
    description: "",
    collection: "",
    highlights: "",
    currency: "INR",
    price: 1,
    returnAndExchange: false
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
        return (
          <Media
            images={images}
            setImages={setImages}
          />
        );
      case 2:
        return "This is the bit I really care about!";
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

    const filterImages = Object.keys(images).map(key => {
      if (images[key].data !== null) {
        return images[key]
      }
      return false
    }).filter(image => image)

    if (filterImages.length > 2) {
      let data = {
        "images": filterImages,
        "categoryId": product.category,
        "category": product.category,
        "collection": product.collection,
        "title": product.title,
        "priceTag": { "currency": product.currency, "value": product.price },
        "description": product.description,
        "inStock": stock,
        "highlights": product.highlights,
        "returnAndExchange": {
          "accepted": product.returnAndExchange,
          "message": "Hassle-free returns and exchanges.",
          "window": "30 days",
          "windowMessage": "Return or exchange within 30 days of purchase."
        }
      }
      const response = await addNewProducts(data)
      enqueueSnackbar(response.message, {
        variant: response.success ? 'success' : 'error'
      })
    } else {
      enqueueSnackbar('Add atleast 3 images', {
        variant: "error"
      })
    }
  };

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
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleAddProduct}
              >
                Add
              </Button>
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
