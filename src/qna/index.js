import { Box, Card, Container } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import PageTitle from '../Common/PageTitle'

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import AddNewQnaModal from './AddNewQnaModal';
import QnaTable from './QnaTable';
import getAllQna from '../services/getAllQna';

const useStyles = makeStyles((theme) => ({
    button: {
        boxShadow: "none",
        fontFamily: "ApercuMedium",
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
    action: {
        marginLeft: "auto",
        marginTop: "0.8rem",
        marginRight: theme.spacing(2),
    },
}));


export default function Qna() {

    const [open, setOpen] = useState(false)

    const [edit, setEdit] = useState(false)
    const [editContent, setEditContent] = useState(null)
    const [qnas, setQnas] = useState(false)
    const [loading, setLoading] = useState(false)

    const classes = useStyles()

    useEffect(() => {
        fetchAllQnas()
    }, [])

    async function fetchAllQnas() {
        setLoading(true)
        const res = await getAllQna()
        if (res.success) {
            setQnas(res.qnas)
            setLoading(false)

        } else {
            setQnas([])
            setLoading(false)


        }
    }


    function handleEdit(content) {
        setEditContent(content)
        setEdit(true)
        setOpen(true)
    }

    function handleEditCancel() {
        setEditContent(null)
        setEdit(false)
        setOpen(false)

    }

    return (
        <>
            <AddNewQnaModal open={open} setOpen={setOpen} edit={edit} editContent={editContent} handleEditCancel={handleEditCancel} fetchAllQnas={fetchAllQnas} />
            <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
                <Card
                    style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingBottom: "1rem",
                    }}
                >
                    <Box style={{ display: "flex" }}>
                        <PageTitle title="Help & QNA" />
                        <div
                            className={classes.action}
                            style={{ marginTOp: 0, lineHeight: 6 }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => setOpen(true)}

                            >
                                Create new QNA
                                <AddIcon className={classes.rightIcon}>Create New Product</AddIcon>
                            </Button>
                        </div>
                    </Box>

                    <QnaTable handleEdit={handleEdit} qnas={qnas} fetchAllQnas={fetchAllQnas} loading={loading} />
                </Card>
            </Container>
        </>
    )
}