import clsx from "clsx";
import React, { useState } from "react";

import Chip from "@material-ui/core/Chip";
import blue from "@material-ui/core/colors/blue";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import ConfirmedIcon from "@material-ui/icons/AssignmentLate";
import CachedIcon from "@material-ui/icons/Cached";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ShippingIcon from "@material-ui/icons/LocalShipping";
import PackingIcon from "@material-ui/icons/MoveToInbox";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";

import { Box, CircularProgress, IconButton, Typography } from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import { getAllOrders } from "../services/getAllOrders";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 0 11px #eaf0f6",
    borderRadius: "4px",
    overflow: "hidden",
    border: "1px solid #eaf0f6",
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    fontFamily: "ApercuMedium",
    fontSize: "0.875rem",
    color: "#525f7f",
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  tableHeadCell: {
    padding: theme.spacing(1),
  },
  tableHeadRow: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderStyle: "solid",
    borderLeftWidth: "3px",
  },
  tableFoot: {
    fontFamily: "ApercuMedium",
    fontSize: "0.875rem",
    color: "#525f7f",
  },
  button: {
    margin: theme.spacing(1),
  },
  primaryButton: {
    backgroundColor: "#2196f3",
  },
  input: {
    display: "none",
  },
  tableRow: {
    borderColor: "#fff",
    borderStyle: "solid",
    borderLeftWidth: "3px",
    borderBottomWidth: "0px",
    borderTopWidth: "0px",
    borderRightWidth: "3px",
    "&:hover": {
      borderColor: theme.palette.primary.light,
      borderStyle: "solid",
      borderLeftWidth: "3px",
      backgroundColor: blue[50],
      borderRightColor: blue[50],
      cursor: "pointer",
    },
  },
  paidChip: {
    backgroundColor: "#66BB6A",
    color: "#fff",
  },
  unfulfilledChip: {
    backgroundColor: "#F44336",
    color: "#fff",
  },
  active: {
    color: theme.palette.primary.main,
  },
  even: {
    backgroundColor: "#fff",
  },
}));

export default function SimpleTable(props) {

  const { orders, setOrders, loading } = props
  const classes = useStyles();

  /* -1: unsorted/unused
      0: is NOT ascending
      1: is ascending
  */
  const [sortData, setSortData] = React.useState({
    id: -1,
  });

  const sortById = () => {
    const dataset = [...orders];

    if (sortData.id < 1) {
      console.log("Unsorted. Sorting By Ascending");
      dataset.sort(function (a, b) {
        return a.orderId - b.orderId;
      });
      setSortData({
        ...sortData,
        id: 1,
      });
    } else {
      console.log("Sorted. Sorting By Descending");
      dataset.reverse();
      setSortData({
        ...sortData,
        id: 0,
      });
    }
    setOrders(dataset);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function StatusChip(props) {
    if (props.status === "PAID") {
      return <Typography variant="body2">Paid</Typography>;
    } else {
      return (
        <Chip
          label={props.status}
          style={{ color: "#1A237E", backgroundColor: "#C5CAE9" }}
        />
      );
    }
  }

  function Fulfillment(props) {
    switch (props.fulfillment) {
      case "Processing":
        return (
          <Chip
            icon={<CachedIcon style={{ color: "#263238" }} fontSize="small" />}
            label={props.fulfillment}
            style={{
              color: "#263238",
              backgroundColor: "#ECEFF1",
              paddingLeft: 2,
            }}
          />
        );

      case "Confirmed":
        return (
          <Chip
            icon={
              <ConfirmedIcon style={{ color: "#FF6F00" }} fontSize="small" />
            }
            label={props.fulfillment}
            style={{
              color: "#FF6F00",
              backgroundColor: "#FFECB3",
              paddingLeft: 2,
            }}
          />
        );

      case "Packing":
        return (
          <Chip
            icon={<PackingIcon style={{ color: "#33691E" }} fontSize="small" />}
            label={props.fulfillment}
            style={{
              color: "#33691E",
              backgroundColor: "#DCEDC8",
              paddingLeft: 2,
            }}
          />
        );

      case "Shipped":
        return (
          <Chip
            icon={
              <ShippingIcon style={{ color: "#0D47A1" }} fontSize="small" />
            }
            label={props.fulfillment}
            style={{
              color: "#0D47A1",
              backgroundColor: "#BBDEFB",
              paddingLeft: 2,
            }}
          />
        );

      case "Unfulfilled":
        return (
          <Chip
            icon={<ErrorIcon style={{ color: "#b71c1c" }} fontSize="small" />}
            label={props.fulfillment}
            style={{
              color: "#b71c1c",
              backgroundColor: "#ffcdd2",
              paddingLeft: 2,
            }}
          />
        );

      default:
        return (
          <Chip
            icon={<DoneIcon style={{ color: "#fff" }} fontSize="small" />}
            label={props.fulfillment}
          />
        );
    }
  }

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHeadRow}>
              <TableCell className={classes.tableHeadCell}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Typography className={classes.tableHead}>
                    Order ID
                  </Typography>
                  <IconButton style={{ marginLeft: "1px" }} onClick={sortById}>
                    <UnfoldMoreIcon
                      fontSize="small"
                      className={clsx(sortData.id > -1 && classes.active)}
                    />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Created
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Customer
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Email
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Fulfillment
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Total
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Status
              </TableCell>
              <TableCell className={classes.tableHead} align="left">
                Last Updated
              </TableCell>
              <TableCell className={classes.tableHead} align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow>
              <TableCell align="center" colSpan={8}>
                <CircularProgress color="primary" />
              </TableCell>
            </TableRow>
              : orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow
                  key={row.orderId}
                  className={classes.tableRow}
                // onClick={(row) =>
                //   props.pageControl({
                //     manage: true,
                //     orderDetails: orders[index],
                //     root: false,
                //     purchaseOrder: false,
                //   })
                // }
                >
                  <TableCell component="th" scope="row">
                    {row.orderId}
                  </TableCell>
                  <TableCell align="left">{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="left">{row.customerName}</TableCell>
                  <TableCell align="left">{row.customerEmail}</TableCell>
                  <TableCell align="left">
                    <Fulfillment fulfillment="Shipped" />
                  </TableCell>
                  <TableCell align="left">INR {row.totalAmount}</TableCell>
                  <TableCell align="left">
                    <StatusChip status={row.paymentStatus} />
                  </TableCell>
                  <TableCell align="left">{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="left">
                    <IconButton size="small" aria-label="settings">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
      <div style={{ width: "100%", marginTop: "1em" }}>
        <Box display="flex">
          <Box width="50%">
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              sx={{ color: 'text.secondary' }}
            />
          </Box>

        </Box>
      </div>
    </React.Fragment >
  );
}
