import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import PageTitle from "./../Common/PageTitle";
import AddCollection from "./AddCollection";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { getAllCollections } from "../services/getCollections";
import updateCollection from "../services/updateCollection";
import { enqueueSnackbar } from "notistack";
import deleteCollection from "../services/deleteCollection";

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

const Collection = (props) => {
  const classes = useStyles();

  const [addCollectionModal, setAddCollectionModal] = React.useState(false);
  const [collectionList, setCollectionList] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editableCollection, setEditableCollection] = useState(null);

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

  const openAddCollectionModal = () => {
    setAddCollectionModal(true);
  };

  const handleEdit = (collection) => {
    setEditableCollection(collection);
    setEdit(true);
    openAddCollectionModal();
  };

  const closeAddCollection = () => {
    setAddCollectionModal(false);
    setEdit(false);
    setEditableCollection(null);
  };

  const getCollectionList = useCallback(async () => {
    setLoading(true);
    const listOfCollections = await getAllCollections();
    if (listOfCollections.collections)
      setCollectionList(listOfCollections.collections);
    setLoading(false);
  }, []);

  const handleUpdateCollection = async (collection) => {
    if (collection.title.length > 2) {
      const response = await updateCollection(collection);
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

  const toggleCollectionEnable = (collection) => {
    const newCollection = { ...collection, enabled: !collection.enabled };
    handleUpdateCollection(newCollection);
  };

  const handleDeleteCollection = async (id) => {
    const response = await deleteCollection(id);
    console.log(response);
    enqueueSnackbar(response.message, {
      variant: response.success ? "success" : "error",
    });
    if (response.success) {
      getCollectionList();
    }
  };

  useEffect(() => {
    getCollectionList();
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
            <PageTitle title="Collection" />
            <div
              className={classes.action}
              style={{ marginTOp: 0, lineHeight: 6 }}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.button2}
                style={{ marginRight: "1em" }}
                onClick={openAddCollectionModal}
              >
                Add Collection
              </Button>
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
                  <TableCell style={{ fontWeight: "bold" }}>Enabled</TableCell>
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
                  collectionList.length > 0 &&
                  collectionList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((collection, _index) => (
                      <TableRow key={collection.id}>
                        <TableCell>{collection.title}</TableCell>
                        <TableCell>{collection.description}</TableCell>
                        <TableCell>
                          {
                            <Switch
                              checked={collection.enabled}
                              color="primary"
                              onClick={() => toggleCollectionEnable(collection)}
                            />
                          }
                        </TableCell>
                        <TableCell>
                          <Box style={{ display: "flex" }}>
                            <IconButton onClick={() => handleEdit(collection)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                handleDeleteCollection(collection.id)
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
              count={collectionList.length}
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
      <Modal
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
      </Modal>
    </React.Fragment>
  );
};

Collection.defaultProps = {};

Collection.propTypes = {};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, null)(Collection);
