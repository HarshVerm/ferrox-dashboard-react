import { Backdrop, Box, Button, Fade, makeStyles, Modal, TextField, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { CustomButton } from "../Common/CustomButton";
import addNewColor from "../services/addNewColor";

const useStyles = makeStyles((theme) => ({

    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        // boxShadow: theme.shadows[5],
        boxShadow: "0 20px 60px -2px rgba(27,33,58,.4)",
        padding: theme.spacing(2, 4, 3),
        outline: "none",
        borderRadius: "8px",
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginRight: theme.spacing(1),
        width: "375px",
    },
    typeField: {
        marginLeft: theme.spacing(1),
        width: "175px",
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    menu: {
        width: 200,
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
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


export default function AddColorsModal({ isModalOpen, closeModal }) {

    const classes = useStyles()
    const [data, setData] = useState({ color: '#452135', label: '' })
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()


    async function addColor() {
        if (data.label && data.color) {
            setLoading(true)
            const res = await addNewColor(data)
            if (res.success) {
                enqueueSnackbar(res.message, { variant: 'success' })

                setLoading(false)
                closeModal()
            } else {
                enqueueSnackbar(res.message, { variant: 'error' })
                setLoading(false)
            }
        } else {
            enqueueSnackbar('Please provide all values', { variant: 'info' })

        }
    }

    function handleChangeComplete(color) {
        setData({ ...data, color: color.hex });
    };
    return (
        <Modal
            disableAutoFocus={true}
            className={classes.modal}
            open={isModalOpen}
            onClose={closeModal}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            closeAfterTransition
            disableBackdropClick
        >
            <Fade in={isModalOpen}>
                <div className={classes.paper}>
                    <div style={{ maxWidth: "80vw", minWidth: "400px" }}>
                        <Typography variant="h5" className={classes.title}>
                            Add New Color
                        </Typography>
                        <TextField
                            id="outlined-name"
                            label="Label"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            value={data.label}
                            name="category"
                            onChange={(e) => setData({ label: e.target.value, color: data.color })}
                        />

                        <SketchPicker
                            color={data.color}
                            onChangeComplete={handleChangeComplete}
                        />
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
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>

                            <CustomButton label="Add" loading={loading} onClick={addColor} />

                        </Box>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}


