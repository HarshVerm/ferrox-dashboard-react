import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CreateProduct from "./CreateProduct";
import CreateProductForm from "./CreateProductForm";
import PageTitle from "./../Common/PageTitle";
import {
  Box,
  Card,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { getAllProducts } from "../services/getAllProducts";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { enqueueSnackbar } from "notistack";
import deleteProduct from "../services/deleteProduct";
import AddNewFeaturedProduct from "./AddNewFeaturedProduct";

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

const Inventory = (props) => {
  const classes = useStyles();

  const [createProductModal, setCreateProductModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [edit, setEdit] = useState(false);
  const [editableProduct, setEditableProduct] = useState({});
  const [addNewFeatureProduct, setAddNewFeatureProduct] = useState(false);

  const [featureProduct, setFeaturedProduct] = useState({
    productId: null,
    productName: null,
  });

  const openNewFeatureProduct = (productName, productId) => {
    setAddNewFeatureProduct(true);
    setFeaturedProduct({
      productId: productId,
      productName: productName,
    });
  };

  const closeNewFeatureProduct = (productName, productId) => {
    setAddNewFeatureProduct(false);
    setFeaturedProduct({
      productId: null,
      productName: null,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openCreateNewProductModal = () => {
    setCreateProductModal(true);
  };

  const closeCreateNewProductModal = () => {
    setEdit(false);
    setEditableProduct({});
    setCreateProductModal(false);
  };

  const editProduct = (product) => {
    setEditableProduct(product);
    setEdit(true);
    openCreateNewProductModal();
  };

  const handleDeleteProduct = async (id) => {
    const response = await deleteProduct(id);
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
    });
    if (response.success) {
      getProductList();
    }
  };

  const getProductList = useCallback(async () => {
    const products = await getAllProducts();
    console.log(products.products);
    if (products.products) setProductList(products.products);
  }, []);

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Card
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <Box style={{ display: "flex" }}>
            <PageTitle title="Products" />
            <div
              className={classes.action}
              style={{ marginTOp: 0, lineHeight: 6 }}
            >
              <CreateProduct createProduct={openCreateNewProductModal} />
            </div>
          </Box>
          <Grid container spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Featured</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.length > 0 &&
                  productList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product, _index) => (
                      <TableRow key={product.productId}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.priceTag.value}</TableCell>
                        <TableCell>
                          {
                            <Switch
                              checked={product.isFeatured ? true : false}
                              color="primary"
                              onClick={() => openNewFeatureProduct(product.title,product.productId)}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          <Box style={{ display: "flex" }}>
                            <IconButton onClick={() => editProduct(product)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleDeleteProduct(product.productId)
                              }
                              style={{ color: "red" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100]}
              component="div"
              count={productList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              sx={{ color: "text.secondary" }}
            />
          </Grid>
        </Card>
      </Container>

      {/* Create Product Modal */}
      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={createProductModal}
        onClose={closeCreateNewProductModal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={createProductModal}>
          <div className={classes.paper}>
            <CreateProductForm
              handleClose={closeCreateNewProductModal}
              edit={edit}
              editableProduct={editableProduct}
              getProductList={getProductList}
            />
          </div>
        </Fade>
      </Modal>

      {/* New Featured Modal */}
      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={addNewFeatureProduct}
        onClose={closeNewFeatureProduct}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={addNewFeatureProduct}>
          <div className={classes.paper}>
            <AddNewFeaturedProduct  onClose={closeNewFeatureProduct} productId ={featureProduct.productId} productName = {featureProduct.productName}/>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

Inventory.defaultProps = {
  products: [],
};

Inventory.propTypes = {
  products: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    products: state.product.products,
  };
}

export default connect(mapStateToProps, null)(Inventory);
