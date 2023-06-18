import { makeStyles } from "@material-ui/core/styles";
import faker from "faker";
import React from "react";
import { connect } from "react-redux";
import { fetchProducts } from "../store/actions/products";

import {
  Box, Container, FormControl, IconButton, InputAdornment, InputLabel,
  OutlinedInput
} from "@material-ui/core/";
import blue from "@material-ui/core/colors/blue";
import CloseIcon from '@material-ui/icons/Close';

import PageTitle from "./../Common/PageTitle";
import DraftOrder from "./DraftOrder";
import Manage from "./Manage/Manage";
import OrdersTable from "./OrdersTable";
import { getAllOrders } from "../services/getAllOrders";

const drawerWidth = 210;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    zIndex: 0,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  paper: {
    boxShadow: "0 0 1px 0 rgba(0,0,0,.22)",
  },
  toolbar: {
    boxShadow: "0 0 11px #eaf0f6",
    display: "inline-block",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  button: {
    margin: theme.spacing(1),
  },
  action: {
    marginLeft: "auto",
    marginTop: "0.8rem",
    marginRight: theme.spacing(2),
  },
  lastUpdated: {
    marginTop: theme.spacing(2),
    padding: 0,
    color: "rgb(112, 117, 122)",
  },
  iconButton: {
    margin: theme.spacing(1),
  },
  button: {
    backgroundColor: blue[100],
    // margin: theme.spacing(1),
    borderRadius: "30px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& $icon": {
        color: "white",
      },
    },
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

// TODO: Organize scheme to its own repository.

function createData(
  orderId,
  created,
  firstName,
  lastName,
  email,
  address,
  city,
  country,
  zip,
  fulfillment,
  total,
  status,
  updated
) {
  return {
    orderId,
    created,
    firstName,
    lastName,
    email,
    address,
    city,
    country,
    zip,
    fulfillment,
    total,
    status,
    updated,
  };
}

// TODO: State should be retrieved from here.

const populate = (n) => {
  const data = [];
  const set = new Set();
  for (let i = 0; i < n; i++) {
    let random = faker.random.number(100);

    while (set.has(random)) {
      random = faker.random.number(100);
    }

    set.add(random);

    data.push(
      createData(
        random,
        faker.date.recent(7).toLocaleDateString(),
        faker.name.firstName(),
        faker.name.lastName(),
        faker.internet.email(),
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.country(),
        faker.address.zipCode(),
        "Processing",
        faker.commerce.price(),
        "Paid",
        "Today"
      )
    );
  }

  return data;
};


const Orders = (props) => {
  const classes = useStyles();

  const [pageControl, setPageControl] = React.useState({
    manage: false,
    orderDetails: null,
    draftOrder: false,
    root: true,
  });

  const [searchText, setSearchText] = React.useState('')

  const openDraftOrder = () => {
    setPageControl({
      manage: false,
      orderDetails: null,
      draftOrder: true,
      root: false,
    });
  };


  const [orders, setOrders] = React.useState([])

  const [filteredOrders, setFilteredOrders] = React.useState([])

  const [loading, setLoading] = React.useState(true)


  async function fetchOrders() {
    setLoading(true)
    const res = await getAllOrders()
    if (res.success && res.orders) {
      setOrders(res.orders)
      setFilteredOrders(res.orders)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrders()
  }, []);

  function clearSearch() {
    setSearchText('')
    setFilteredOrders(orders)
  }

  function handleSearch(e) {
    setSearchText(e.target.value)
    e.target.value.trim().length > 2 && setFilteredOrders(orders.filter((order) => order.orderId === e.target.value))
  }





  const OrdersMain = (props) => {
    return (
      <Container maxWidth="lg">
        <PageTitle title="Orders" />
        <Box display="flex" flexGrow={1} paddingBottom={3}>

          <FormControl variant="outlined" size='small' style={{ minWidth: '400px' }}>
            <InputLabel htmlFor="outlined-adornment-password">Search order</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={'text'}
              value={searchText}
              onChange={handleSearch}
              endAdornment={
                <InputAdornment position="end">
                  {searchText.trim().length ?
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={clearSearch}

                      edge="end"
                    >
                      <CloseIcon />
                    </IconButton> : null
                  }
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        </Box>

        <OrdersTable orders={filteredOrders} setOrders={setFilteredOrders} pageControl={setPageControl} loading={loading} />
      </Container>
    );
  };

  // TODO: Need to refactor. This is a workaround for Router (since its connected to Tabs, its difficult to hack)

  return (
    <React.Fragment>
      {pageControl.manage && (
        <Manage pageControl={pageControl} setPageControl={setPageControl} />
      )}
      {pageControl.root && <OrdersMain />}
      {pageControl.draftOrder && (
        <DraftOrder pageControl={pageControl} setPageControl={setPageControl} />
      )}
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    products: state.product.products,
  };
}

export default connect(mapStateToProps, null)(Orders);
