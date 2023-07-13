import { Backdrop, Box, Button, Fade, FormControl, FormLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CustomButton } from '../Common/CustomButton';
import addQna from '../services/addQna';
import editQna from '../services/editQna';


const QnaTypes = [
    "MY STYLINGORA ACCOUNT",
    "ITEMS & SIZES",
    "GIFT OPTIONS",
    "SHIPPING",
    "PAYMENT & INVOICES",
    "MY PURCHASES"
]

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
    const [selectedType, setSelectedType] = useState(null)



    useEffect(() => {
        if (edit === true) {
            setQnaTitle(editContent.title)
            setContent(editContent.content)
            setSelectedType(editContent.type)
        }
    }, [edit])
    function handleClose() {
        setOpen(false)
    }

    function handleTitleChange(e) {
        setQnaTitle(e.target.value)
    }

    async function addNewQna() {
        if (content.trim().length > 0 && qnaTitle.trim().length > 0 && selectedType) {
            if (!edit) {
                console.log(selectedType)
                add()

            } else {
                editThisQna()
            }

        } else {
            enqueueSnackbar('Please add enough title, content & selectedType', { variant: 'warning' })

        }

    }

    async function add() {
        setLoading(true)

        const res = await addQna({ title: qnaTitle, content, createdAt: Date.now(), updatedAt: Date.now(), type: selectedType, link: qnaTitle.toLowerCase().split(" ").join("-") })

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

        const res = await editQna({ id: editContent.id, title: qnaTitle, link: qnaTitle.toLowerCase().split(" ").join("-"), content, createdAt: Date.now(), type: selectedType })
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

    function handleChangeType(e) {
        console.log(e.target.value)
        setSelectedType(e.target.value)
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

                        <FormLabel>
                            Title
                        </FormLabel>
                        <TextField
                            id="outlined-name"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            value={qnaTitle}
                            name="qnaTitle"
                            onChange={handleTitleChange}
                        />

                        <FormControl
                            variant="outlined"
                            fullWidth
                            style={{ margin: '14px 0' }}
                        >
                            <FormLabel>
                                Select Type
                            </FormLabel>
                            <Select
                                value={selectedType}
                                labelWidth={0}
                                inputProps={{
                                    name: "type",
                                    id: "outlined-type-simple",
                                }}
                                name="type"
                                onChange={handleChangeType}
                                style={{ marginTop: '8px' }}
                            >
                                {QnaTypes.map((type) => {
                                    return (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>

                                    )
                                })}
                            </Select>
                        </FormControl>

                        <FormLabel>
                            Content
                        </FormLabel>
                        <ReactQuill style={{ marginTop: '8px' }} theme="snow" value={content} onChange={setContent} />

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
