import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Card from './Card';
import Grid from '@material-ui/core/Grid';
import Orders from '../Common/img/orders.png';
import Board from '../Common/img/board.png';
import NewProduct from '../Common/img/new-product.png';
import ChangePassword from '../Common/img/change-password.png';
import ManageAccounts from '../Common/img/manage-accounts.png';
import ProductInformation from '../Common/img/product-information.png';
import ProductStock from '../Common/img/product-stock.png';
import UsersTable from './UsersTable';
import PageTitle from '../Common/PageTitle';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: '5em',
    marginTop: "2em"
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
        <Grid item lg={12}>
          <PageTitle title="Active Users" />
          <UsersTable />

        </Grid>

      </Grid>

    </Container>
  );
}

export default Home;