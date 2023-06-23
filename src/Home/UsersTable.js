
import clsx from "clsx";
import React, { useEffect, useState } from "react";

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
import { useHistory } from "react-router-dom"
import { getAllUsers } from "../services/getAllUsers";

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

export default function UsersTable(props) {

    const classes = useStyles();

    const [users, setUsers] = useState([])

    const [loading, setLoading] = useState([])

    const [sortData, setSortData] = React.useState({
        id: -1,
    });

    const sortById = () => {
        const dataset = [...users];

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
        setUsers(dataset);
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
    const history = useHistory()

    async function fetchUsers() {
        const res = await getAllUsers()
        res.success && res.users && setUsers(res.users)
        setLoading(false)
    }

    const handleRedirect = (orderId) => {
        console.log(orderId)
        if (orderId) {
            history.push(`/dashboard/orderDetails/${orderId}`)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchUsers()
    }, [])

    console.log(users)

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
                                        User ID
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
                                Name
                            </TableCell>
                            <TableCell className={classes.tableHead} align="left">
                                Email
                            </TableCell>
                            <TableCell className={classes.tableHead} align="left">
                                Phone
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
                            : users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={classes.tableRow}

                                >
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="left">{row.displayName}</TableCell>
                                    <TableCell align="left">{row.email}</TableCell>
                                    <TableCell align="left">{row.phoneNumber || "-"}</TableCell>
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
                            count={users.length}
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
