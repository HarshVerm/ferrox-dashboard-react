import React, { Fragment } from "react";
import { Switch, Route, Link, BrowserRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { userSignOutRequest } from "./store/actions/auth";
import { SnackbarProvider } from "notistack";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import blue from "@material-ui/core/colors/blue";
import {
  Avatar,
  Modal,
  Backdrop,
  Fade,
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Orders from "./Orders/Orders";
import Home from "./Home/Home";
import Inventory from "./Inventory/Inventory";
import Settings from "./Settings/Settings";
import Board from "./Board/Board";
import Login from "./Login/Login";
import Team from "./Team/Team";
import AddNewProductPage from './Inventory/AddNewProduct'
import PrivateRoute from "./Common/PrivateRoute";
import getAvatar from "./Common/AnimalAvatars";
import "./App.css";
import Category from "./Inventory/Category";
import Collections from "./Inventory/Collections";
import Featured from "./Inventory/Featured";
import OrderDetails from "./Orders/OrderDetails";
import Qna from "./qna";
import ColorsPage from "./colors";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    zIndex: 3000,
    boxShadow: "0 10px 20px rgba(0,0,0,0.025), 0 2px 2px rgba(0,0,0,0.05)",
    borderRadius: "0px",
    padding: "2px 0px 0px 5px",
    overflow: "hidden",
    // backgroundColor: '#1a237e',
  },
  tab: {
    fontFamily: "ApercuMedium",
    textTransform: "none",
    // color: '#fff',
    color: "#525f7f",
    fontSize: "0.85rem",
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: "none",
  },
  avatarGroup: {
    position: "absolute",
    top: "0.5rem",
    left: "calc(100% - 75px)",
    color: "rgba(0,0,0,0.54)",
    "&:hover": {
      cursor: "pointer",
      color: blue[500],
    },
  },
  paper: {
    backgroundColor: "#fff",
    // boxShadow: theme.shadows[5],
    boxShadow: "0 20px 60px -2px rgba(27,33,58,.4)",
    padding: "2em",
    outline: "none",
    borderRadius: "8px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "ApercuMedium",
    marginTop: "2em",
    marginBottom: "2em",
  },
  button: {
    boxShadow: "none",
  },
  avatarIcon: {
    marginLeft: 5,
    marginTop: 5,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
  },
  typography: {
    fontFamily: [
      "Apercu",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          border: "2px solid",
          borderColor: blue[200],
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "none",
      },
    },
  },
});

function App(props) {
  const classes = useStyles();

  const { user, isAuthenticated } = props.auth;

  const [logoutModal, setLogoutModal] = React.useState(false);

  const RedirectToDashboard = () => (
    <Fragment>
      {isAuthenticated ? <Redirect to="/dashboard/home" /> : null}
    </Fragment>
  );

  const handleLogoutOpen = () => {
    setLogoutModal(true);
  };

  const handleLogoutClose = () => {
    setLogoutModal(false);
  };

  const logout = (e) => {
    e.preventDefault();
    handleLogoutClose();
    props.userSignOutRequest();
  };

  const AvatarGroup = (props) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        className={classes.avatarGroup}
        onClick={handleLogoutOpen}
      >
        <Avatar className={classes.avatar} src={getAvatar(user.avatarId)} />
        <ExpandMoreIcon className={classes.avatarIcon} />
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider autoHideDuration={3000} />
      <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={Login} />
          <RedirectToDashboard />
          <Route
            path="/dashboard"
            render={({ location }) => (
              <Fragment>
                <Paper className={classes.root}>
                  <Tabs
                    value={location.pathname}
                    centered
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab
                      label="Active Users"
                      value="/dashboard/home"
                      component={Link}
                      to="/dashboard/home"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Orders"
                      value="/dashboard/orders"
                      component={Link}
                      to="/dashboard/orders"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Products"
                      value="/dashboard/products"
                      component={Link}
                      to="/dashboard/products"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Configs & Colors"
                      value="/dashboard/configs"
                      component={Link}
                      to="/dashboard/configs"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Featured"
                      value="/dashboard/featured"
                      component={Link}
                      to="/dashboard/featured"
                      disableRipple
                      className={classes.tab}
                    />

                    <Tab
                      label="Categories"
                      value="/dashboard/category"
                      component={Link}
                      to="/dashboard/category"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Collections"
                      value="/dashboard/collection"
                      component={Link}
                      to="/dashboard/collection"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Help & QNA"
                      value="/dashboard/qna"
                      component={Link}
                      to="/dashboard/qna"
                      disableRipple
                      className={classes.tab}
                    />
                    <Tab
                      label="Settings"
                      value="/dashboard/settings"
                      component={Link}
                      to="/dashboard/settings"
                      disableRipple
                      className={classes.tab}
                    />x
                  </Tabs>
                </Paper>
                <Switch>
                  <Route path="/dashboard/settings" component={Settings} />
                  <Route
                    path="/inventory/wizard"
                    exact
                    render={() => <div>Inventory Wizard</div>}
                  />
                  <Route path="/dashboard/products" component={Inventory} />
                  <Route path="/dashboard/add-new-product" component={AddNewProductPage} exact />
                  <Route path="/dashboard/category" component={Category} />
                  <Route path="/dashboard/collection" component={Collections} />
                  <Route path="/dashboard/featured" component={Featured} />
                  <Route path="/dashboard/board" component={Board} />
                  <Route path="/dashboard/configs" component={ColorsPage} />
                  <Route
                    path="/dashboard/orderDetails/:orderId"
                    component={OrderDetails}
                    exact={true}
                  />
                  <Route path="/dashboard/qna" component={Qna} />

                  <Route path="/dashboard/orders" component={Orders} />
                  <Route
                    path="/dashboard/home"
                    authed={isAuthenticated}
                    component={Home}
                  />
                  <Route
                    path="/dashboard/team"
                    authed={isAuthenticated}
                    component={Team}
                  />
                  <Route
                    path="/dashboard/team"
                    authed={isAuthenticated}
                    component={Team}
                  />
                  <Route path="*">
                    <Redirect to="/dashboard/home" />
                  </Route>
                </Switch>
              </Fragment>
            )}
          />
          {isAuthenticated ? <AvatarGroup /> : null}

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={logoutModal}
            onClose={handleLogoutClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={logoutModal}>
              <div className={classes.paper}>
                <Typography variant="h5" className={classes.title}>
                  Are you sure you want to sign out?
                </Typography>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  style={{ marginTop: "2em" }}
                >
                  <Button
                    color="primary"
                    style={{ marginRight: 10 }}
                    onClick={handleLogoutClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </Box>
              </div>
            </Fade>
          </Modal>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  userSignOutRequest: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { userSignOutRequest })(App);
