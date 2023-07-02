import { Box, CircularProgress, IconButton, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { unix } from 'moment';
import React, { useState } from 'react';
import deleteQna from '../services/deleteQna';

export default function QnaTable({ handleEdit, qnas, fetchAllQnas, loading }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    async function handleDeleteQna(id) {
        const res = await deleteQna(id)
        res.success === true && fetchAllQnas()
    }

    return (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>
                            Created On
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Enabled</TableCell>
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
                        qnas.length > 0 &&
                        qnas
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((qna, _index) => (
                                <TableRow key={qna.id}>
                                    <TableCell>{qna.title}</TableCell>
                                    <TableCell>{unix(qna.createdAt / 1000).format("MM/DD/YYYY")}</TableCell>

                                    <TableCell>
                                        <Box style={{ display: "flex" }}>
                                            <IconButton onClick={() => handleEdit(qna)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                style={{ color: "red" }}
                                                onClick={() => handleDeleteQna(qna.id)}
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
                count={qnas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                sx={{ color: "text.secondary" }}
            />
        </Box>
    )
}