import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchProducts } from "../store/actions/products";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import RefreshIcon from "@material-ui/icons/Refresh";
import CreateProduct from "./CreateProduct";
import InventoryItem from "./InventoryItem";
import EmptyInventory from "./EmptyInventory";
import AddCategory from "./AddCategory";
import ProductModal from "./ProductModal";
import CreateProductForm from "./CreateProductForm";
import PageTitle from "./../Common/PageTitle";
import AddCollection from "./AddCollection";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: 0,
    top: "auto",
    left: "auto",
    position: "fixed",
    bottom: theme.spacing(7),
    right: theme.spacing(7),
  },
  action: {
    marginLeft: "auto",
    marginTop: "0.8rem",
    marginRight: theme.spacing(2),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  createProductModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[5],
    boxShadow: "0 20px 60px -2px rgba(27,33,58,.4)",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    borderRadius: "8px",
  },
  emptyIcon: {
    color: "#00000032",
    fontSize: "10em",
  },
  emptyContainer: {
    marginTop: "25vh",
  },
  title: {
    fontFamily: "ApercuMedium",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
  },
  button2: {
    boxShadow: "none",
    fontFamily: "ApercuMedium",
  },
  toolbar: {
    // boxShadow: '0 0 1px 0 rgba(0,0,0,.22)',
    boxShadow: "0 0 11px #eaf0f6",
    display: "inline-block",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  lastUpdated: {
    marginTop: theme.spacing(2),
    padding: 0,
    color: "rgb(112, 117, 122)",
  },
}));

const Category = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState({
    id: "ID",
    name: "Name",
    type: "Type",
    description: "Description",
  });

  const [addCategoryModal, setAddCategoryModal] = React.useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = React.useState("N/A");

  React.useEffect(() => {
    props.dispatch(fetchProducts());
    setLastUpdatedTime(`${new Date().toLocaleString()}`);
  }, []);

  const openAddCategoryModal = () => {
    setAddCategoryModal(true);
  };

  const closeAddCategory = () => {
    setAddCategoryModal(false);
  };

  const handleOpen = (product) => {
    setProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <PageTitle title="Inventory" />
        <Paper className={classes.toolbar}>
          <div style={{ display: "flex" }}>
            <div>
              <IconButton className={classes.button} color="primary">
                <ViewModuleIcon />
              </IconButton>
              <IconButton className={classes.button}>
                <ViewHeadlineIcon />
              </IconButton>
              <IconButton className={classes.button}>
                <RefreshIcon />
              </IconButton>
            </div>
            <div className={classes.action}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button2}
                style={{ marginRight: "1em" }}
                onClick={openAddCategoryModal}
              >
                Add Category
              </Button>
            </div>
          </div>
        </Paper>
        {props.products.length === 0 || props.products.length === null ? (
          <EmptyInventory />
        ) : (
          <React.Fragment>
            <Grid container spacing={2}>
              {props.products.map((product) => (
                <Grid item xs={4} key={product.id}>
                  <InventoryItem item={product} openModal={handleOpen} />
                </Grid>
              ))}
            </Grid>
            <Container className={classes.lastUpdated}>
              <Typography variant="overline">
                Inventory up to date. Last retrieved at {lastUpdatedTime}
              </Typography>
            </Container>
          </React.Fragment>
        )}
      </Container>

      <Zoom
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        in={true}
        unmountOnExit
      >
        <Fab
          color="primary"
          className={classes.fab}
          onClick={openAddCategoryModal}
        >
          <SearchIcon />
        </Fab>
      </Zoom>

      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <ProductModal item={product} setProduct={setProduct} />
          </div>
        </Fade>
      </Modal>

      {/* Category Modal */}
      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={addCategoryModal}
        onClose={closeAddCategory}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={addCategoryModal}>
          <div className={classes.paper}>
            <AddCategory onClose={closeAddCategory} />
          </div>
        </Fade>
      </Modal>

  
    </React.Fragment>
  );
};

Category.defaultProps = {
  products: [],
};

Category.propTypes = {
  products: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    products: state.product.products,
  };
}

export default connect(mapStateToProps, null)(Category);
