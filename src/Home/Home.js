import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Card from './Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Orders from '../Common/img/orders.png';
import Board from '../Common/img/board.png';
import NewProduct from '../Common/img/new-product.png';
import ChangePassword from '../Common/img/change-password.png';
import ManageAccounts from '../Common/img/manage-accounts.png';
import ProductInformation from '../Common/img/product-information.png';
import ProductStock from '../Common/img/product-stock.png';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: '5em',
    marginTop:"2em"
  },
  title: {
    fontFamily: 'ApercuMedium',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  }
}));

function Home(props) {
  const [count, setCount] = useState(0);
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="lg" >
      <Grid container spacing={2} >
        <Grid item xs={3}>
          <Card
            title="Orders"
            button="Manage Orders"
            description="View and update orders. Find orders by email or order ID."
            route="/orders"
            image={Orders}
          />
        </Grid>
       
        <Grid item xs={3}>
          <Card
            title="Products"
            button="Update Product Information"
            description="Update products name, type, description, etc."
            route="/inventory"
            image={ProductInformation}
          />
        </Grid>
        <Grid item xs={3}>
          <Card
            title="User Accounts"
            button="Manage User Accounts"
            description="Create or remove accounts that have access to this dashboard."
            route="/settings"
            image={ManageAccounts}
          />
        </Grid>

      </Grid>
   
    </Container>
  );
}

export default Home;