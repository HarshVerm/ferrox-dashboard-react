import { Backdrop, Box, Button, Fade, TextField, Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CustomButton } from '../Common/CustomButton';
import addQna from '../services/addQna';
import editQna from '../services/editQna';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        // boxShadow: theme.shadows[5],
        boxShadow: "0 20px 60px -2px rgba(27,33,58,.4)",
        padding: theme.spacing(2, 4, 3),
        outline: "none",
        borderRadius: "8px",
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        boxShadow: "none",
    },
    title: {
        fontFamily: "ApercuMedium",
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}));

export default function AddNewQnaModal({ open, setOpen, edit, editContent, handleEditCancel, fetchAllQnas }) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar()

    const [qnaTitle, setQnaTitle] = useState('')
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        if (edit === true) {
            setQnaTitle(editContent.title)
            setContent(editContent.content)
        }
    }, [edit])
    function handleClose() {
        setOpen(false)
    }

    function handleTitleChange(e) {
        setQnaTitle(e.target.value)
    }

    async function addNewQna() {
        if (content.trim().length > 0 && qnaTitle.trim().length > 0) {
            if (!edit) {

                add()

            } else {
                editThisQna()
            }

        } else {
            enqueueSnackbar('Please add enough title and content', { variant: 'warning' })

        }

    }

    async function add() {
        setLoading(true)

        const res = await addQna({ title: qnaTitle, content, createdAt: Date.now(), updatedAt: Date.now() })

        if (res.success) {
            enqueueSnackbar(res.message, { variant: 'success' })
            fetchAllQnas()
            setLoading(false)
            setOpen(false)
        } else {
            enqueueSnackbar(res.message, { variant: 'error' })

            setLoading(false)
        }
    }

    async function editThisQna() {
        setLoading(true)

        const res = await editQna({ id: editContent.id, title: qnaTitle, content, createdAt: Date.now() })
        if (res.success) {
            fetchAllQnas()
            enqueueSnackbar(res.message, { variant: 'success' })
            setLoading(false)
            handleEditCancel()
        } else {
            enqueueSnackbar(res.message, { variant: 'error' })

            setLoading(false)
        }
    }

    return (
        <Modal
            disableAutoFocus={true}
            className={classes.modal}
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            closeAfterTransition
            disableBackdropClick
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <div style={{ maxWidth: "80vw", minWidth: "800px" }}>
                        <Typography variant="h5" className={classes.title}>
                            Add New QNA
                        </Typography>
                        <TextField
                            id="outlined-name"
                            label="Title"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            value={qnaTitle}
                            name="qnaTitle"
                            onChange={handleTitleChange}
                        />

                        <ReactQuill theme="snow" value={content} onChange={setContent} />

                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            style={{ marginTop: "2em" }}
                        >
                            <Button
                                vsize="small"
                                color="primary"
                                className={classes.button}
                                style={{ marginRight: 10 }}
                                onClick={edit === true ? handleEditCancel : handleClose}
                            >
                                Cancel
                            </Button>

                            <CustomButton loading={loading} onClick={addNewQna} label={edit ? 'Update' : 'Add'} />

                        </Box>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
