import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

import CreateProduct from './CreateProduct';
import RemoveProduct from './RemoveProduct';
import UpdateProduct from './UpdateProduct';
import UpdateProductStock from './UpdateProductStock';
import InventoryItem from './InventoryItem';
import EmptyInventory from './EmptyInventory';
import SearchModal from './SearchModal';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    position: 'fixed',
    bottom: theme.spacing(7),
    right: theme.spacing(7),
  },
  actions: {
    marginBottom: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[5],
    boxShadow: '0 20px 60px -2px rgba(27,33,58,.4)',
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
    borderRadius: '8px'
  },
  emptyIcon: {
    color: '#00000032',
    fontSize: '10em'
  },
  emptyContainer: {
    marginTop: '25vh',
  },
  title: {
    fontFamily: 'ApercuMedium',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  button: {
    margin: theme.spacing(1)
  },
  toolbar: {
    boxShadow: '0 0 1px 0 rgba(0,0,0,.22)',
    display: 'inline-block',
    marginBottom: theme.spacing(1)
  }
}));

const Inventory = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState({
    id: 'ID',
    name: 'Name',
    type: 'Type',
    description: 'Description',
  });

  const [searchModal, setSearchModal] = React.useState(false);

  const [products, setProducts] = React.useState([
    // {
    //   id: '1',
    //   name: 'Nike Air Max',
    //   type: 'Shoes',
    //   description: 'These shoes are cool.',
    // },
    // {
    //   id: '2',
    //   name: 'Grey Jumper',
    //   type: 'Clothes',
    //   description: 'This jumper is warm.',
    // }
  ]);

  const createNewProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: 'Nike Air Max',
        type: 'Shoes',
        description: 'These shoes are cool.',
      },
    ])
  }

  const openSearchModal = () => {
    setSearchModal(true);
  }

  const closeSearchModal = () => {
    setSearchModal(false);
  }

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
        <Typography variant="h4" className={classes.title} gutterBottom>Inventory</Typography>
        <Grid container spacing={1} className={classes.actions}>
          <Grid item xs={3}>
            <CreateProduct createProduct={createNewProduct}></CreateProduct>
          </Grid>
          <Grid item xs={3}>
            <UpdateProduct></UpdateProduct>
          </Grid>
          <Grid item xs={3}>
            <UpdateProductStock></UpdateProductStock>
          </Grid>
          <Grid item xs={3}>
            <RemoveProduct></RemoveProduct>
          </Grid>
        </Grid>
          <Paper className={classes.toolbar}>
            <IconButton className={classes.button} color="primary">
              <ViewModuleIcon />
            </IconButton>
            <IconButton className={classes.button}>
              <ViewHeadlineIcon />
            </IconButton>
          </Paper>
        {
          (products.length === 0 || products.length === null) ? (
            <EmptyInventory />
          ) : (
              <Grid container spacing={2}>
                {
                  products.map((product) => (
                    <Grid item xs={4} key={product.id}>
                      <InventoryItem item={product} openModal={handleOpen} />
                    </Grid>
                  ))
                }
              </Grid>
            )
        }
      </Container>

      <Zoom
        timeout={transitionDuration}
        style={{
          transitionDelay: `${transitionDuration.exit}ms`,
        }}
        in={true}
        unmountOnExit
      >
        <Fab color="primary" className={classes.fab} aria-label="search" onClick={openSearchModal}>
          <SearchIcon />
        </Fab>
      </Zoom>

      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <div className={classes.paper}>
            <h2>{product.name}</h2>
            <p>{product.type}</p>
            <p>{product.id}</p>
          </div>
        </Fade>
      </Modal>

      {/* Search Modal */}
      <Modal
        disableAutoFocus={true}
        className={classes.modal}
        open={searchModal}
        onClose={closeSearchModal}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        closeAfterTransition
        disableBackdropClick>
        <Fade in={searchModal}>
          <div className={classes.paper}>
            <SearchModal onClose={closeSearchModal} />
          </div>
        </Fade>
      </Modal>

    </React.Fragment>
  );
}

export default Inventory;