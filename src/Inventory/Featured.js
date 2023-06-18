import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import PageTitle from "./../Common/PageTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { enqueueSnackbar } from "notistack";
import { getAllLandingItems } from "../services/getAllLandingItems";
import deleteLandingItem from "../services/deleteLandingItem";

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

const Featured = (props) => {
  const classes = useStyles();

  const [featuredList, setFeaturedList] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getFeaturedList = useCallback(async () => {
    setLoading(true)
    const listOfFetured = await getAllLandingItems();
    if (listOfFetured.items) setFeaturedList(listOfFetured.items);
    setLoading(false)
    console.log(listOfFetured)
  }, []);

  const handleDeleteFeatured = async (id, prodId) => {
    const response = await deleteLandingItem(id, prodId);
    console.log(response);
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
    });
    if (response.success) {
      getFeaturedList();
    }
  };

  useEffect(() => {
    getFeaturedList();
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
            <PageTitle title="Featured Product" />
            <div
              className={classes.action}
              style={{ marginTOp: 0, lineHeight: 6 }}
            ></div>
          </Box>
          <Grid container spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Featured ID
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Mode</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Web URL</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Mobile URL</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  featuredList.length > 0 &&
                  featuredList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((featured, _index) => (
                      <TableRow key={featured.id}>
                        <TableCell>{featured.id}</TableCell>
                        <TableCell>{featured.mode}</TableCell>
                        <TableCell>
                          <a
                            href={
                              featured.mode === "IMAGE"
                                ? featured.primaryImageWeb
                                : featured.primaryVideoWeb
                            }
                            target="_blank"
                          >
                            Click Here
                          </a>
                        </TableCell>
                        <TableCell>
                          <a
                            href={
                              featured.mode === "IMAGE"
                                ? featured.primaryImageMobile
                                : featured.primaryVideoMobile
                            }
                            target="_blank"
                          >
                            Click Here
                          </a>
                        </TableCell>
                        <TableCell>
                          <Box style={{ display: "flex" }}>
                            <IconButton
                              onClick={() =>
                                handleDeleteFeatured(
                                  featured.id,
                                  featured.productId
                                )
                              }
                              style={{ color: "red" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100]}
              component="div"
              count={featuredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              sx={{ color: "text.secondary" }}
            />
          </Grid>
        </Card>
      </Container>

      {/* Collection Modal */}
      {/* <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={addCollectionModal}
        onClose={closeAddCollection}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick
      >
        <Fade in={addCollectionModal}>
          <div className={classes.paper}>
            <AddCollection
              onClose={closeAddCollection}
              edit={edit}
              collection={editableCollection}
              handleUpdate={handleUpdateCollection}
              getCollectionList={getCollectionList}
            />
          </div>
        </Fade>
      </Modal> */}
    </React.Fragment>
  );
};

Featured.defaultProps = {};

Featured.propTypes = {};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, null)(Featured);
