import { Backdrop, Box, Button, ButtonGroup, Card, Checkbox, Container, Fade, FormControl, FormControlLabel, Grid, IconButton, InputLabel, makeStyles, MenuItem, Modal, Select, TextField, Typography } from '@material-ui/core'
import React, { useCallback, useState } from 'react'
import PageTitle from '../Common/PageTitle'
import { getAllCategories } from '../services/getCategories'
import { getAllCollections } from '../services/getCollections'
import fileToBase64 from '../utils/fileToBase64'
import "./Form/styles.css";
import CancelIcon from "@material-ui/icons/Cancel";
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import AddIcon from "@material-ui/icons/Add";
import addNewProducts from '../services/addNewProduct'
import { useSnackbar } from 'notistack'
import { useHistory, useLocation } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    action: {
        marginLeft: "auto",
        marginTop: "0.8rem",
        marginRight: theme.spacing(2),
    },
    title: {
        fontFamily: "ApercuMedium",
    },
    formControl: {
        minWidth: 120,
        marginTop: theme.spacing(2),
    },
    box: {
        overflow: "scroll",
    },
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
        minWidth: 300
    },
}))

const Colors = [
    { label: "BEIGE", value: "#D0BE95" },
    { label: "BLACK", value: "#000" },
    { label: "BLUE", value: "#3472A9" },
    { label: "GREEN", value: "#61882D" },
    { label: "GRAY", value: "#838383" },
    { label: "KHAKI", value: "#8A896E" },
    { label: "NEON", value: "#E4FF3B" },
    { label: "PINK", value: "#E46EB5" }
]


export default function AddNewProductPage() {

    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()
    const { push } = useHistory()

    const inputLabel = React.useRef(null);
    const [openVariationSelect, setOpenVariationSelect] = useState(false)
    const [newVariant, setNewVariant] = useState()
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [collections, setCollections] = useState([])
    const [categories, setCategories] = useState([])

    const [product, setProduct] = React.useState({
        title: "",
        category: "",
        description: "",
        collection: "",
        highlights: "",
        currency: "INR",
        mrpPrice: 1,
        sellingPrice: 1,
        returnAndExchange: false,
        categoryId: "",
        collectionId: "",
        isFeatured: false,
        isFeaturedId: null,
        color: "No Variation"

    });


    const [variation, setVariation] = useState([
        {
            color: { label: "No Variation", value: undefined },
            showcase: {
                0: {
                    data: null,
                    extension: null,
                },
                1: {
                    data: null,
                    extension: null,
                },
                2: {
                    data: null,
                    extension: null,
                },
                3: {
                    data: null,
                    extension: null,
                },
            },
            product: {
                0: {
                    data: null,
                    extension: null,
                },
                1: {
                    data: null,
                    extension: null,
                },
                2: {
                    data: null,
                    extension: null,
                },
                3: {
                    data: null,
                    extension: null,
                },
            }
        }
    ])


    const [stock, setStock] = useState({
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
        XXL: 0,
    });

    const [loading, setLoading] = useState(false);


    const handleChangeProductDetails = (event) => {
        event.persist();
        setProduct((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const handleChangeVariation = (_index, vari) => {
        const newVariation = variation
        const obj = newVariation.at(_index)
        newVariation.splice(_index, 1)
        setVariation([...newVariation, { ...obj, color: { label: vari.label, value: vari.value } }])
    }

    const handleSelectCollection = (event) => {
        event.persist();
        const filterList = collections.filter(item => item.id === event.target.value)
        setProduct((prevState) => {
            return { ...prevState, collectionId: event.target.value, collection: filterList[0].title };
        });
    }
    const handleSelectCategory = (event) => {
        event.persist();
        const filterList = categories.filter(item => item.id === event.target.value)
        setProduct((prevState) => {
            return { ...prevState, categoryId: event.target.value, category: filterList[0].title };
        });
    }

    const handleChangeStock = (event) => {
        event.persist();
        setStock((prevState) => {
            return { ...prevState, [event.target.name]: Number(event.target.value) };
        });
    };

    const handleChecked = (event) => {
        event.persist();

        setProduct((prevState) => {
            return { ...prevState, returnAndExchange: event.target.checked };
        });
    }

    const getList = useCallback(async () => {
        const listOfCategory = await getAllCategories()
        if (listOfCategory.categories) setCategories(listOfCategory.categories)
        const listOfCollections = await getAllCollections()
        if (listOfCollections.collections) setCollections(listOfCollections.collections)
    }, [])

    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        getList()
    }, []);

    const handleImageChange = (_vrIndex, index, mode, event) => {
        event.persist();
        const file = event.target.files[0];
        const filePromise = fileToBase64(file);
        const extension = file.name.split(".")[1]

        Promise.resolve(filePromise).then((base64Images) => {
            const newVariation = variation
            const obj = newVariation.at(_vrIndex)
            newVariation.splice(_vrIndex, 1)
            setVariation([...newVariation, {
                ...obj, [mode]: {
                    ...obj[mode],
                    [index]: { data: base64Images.result, extension, id: null }
                }
            }])
        });
    };

    const removeImage = (_vrIndex, index, mode) => {
        const newVariations = variation
        const obj = newVariations.at(_vrIndex)
        newVariations.splice(_vrIndex, 1)
        setVariation([...newVariations, {
            ...obj, [mode]: {
                ...obj[mode],
                [index]: { data: null, extension: null, id: null }
            }
        }])

    }

    const addNewVariation = () => {
        const newVariation = {
            color: newVariant,
            showcase: {
                0: {
                    data: null,
                    extension: null,
                },
                1: {
                    data: null,
                    extension: null,
                },
                2: {
                    data: null,
                    extension: null,
                },
                3: {
                    data: null,
                    extension: null,
                },
            },
            product: {
                0: {
                    data: null,
                    extension: null,
                },
                1: {
                    data: null,
                    extension: null,
                },
                2: {
                    data: null,
                    extension: null,
                },
                3: {
                    data: null,
                    extension: null,
                },
            }
        }

        setVariation([...variation, newVariation])

        setOpenVariationSelect(false)
    }

    function exist(arr, value) {
        let isExist = false
        for (let i = 0; i < arr.length; i++) {
            const val = arr[i]
            if (val.value === value) {
                isExist = true
                break
            } else {
                isExist = false
            }
        }

        return isExist
    }

    const removeVariation = (index) => {
        const newVariations = variation
        newVariations.splice(index, 1)
        setVariation([...newVariations])
    }


    const handleAddProduct = async () => {
        setLoading(true);

        const mappedVariation = variation.map((vari) => {
            return {
                color: vari.color,
                showcase: Object.keys(vari.showcase).map((item) => { return vari.showcase[item].data !== null ? vari.showcase[item] : null }).filter((item) => item !== null),
                product: Object.keys(vari.product).map((item) => { return vari.showcase[item].data !== null ? vari.showcase[item] : null }).filter((item) => item !== null)

            }
        })

        if (mappedVariation.length) {
            let data = {
                variations: mappedVariation,
                categoryId: product.categoryId,
                category: product.category,
                collection: product.collection,
                collectionId: product.collectionId,
                title: product.title,
                mrpPrice: { currency: product.currency, value: product.mrpPrice },
                sellingPrice: { currency: product.currency, value: product.sellingPrice },
                description: product.description,
                inStock: stock,
                highlights: product.highlights,
                returnAndExchange: {
                    accepted: product.returnAndExchange,
                    message: "Hassle-free returns and exchanges.",
                    window: "30 days",
                    windowMessage: "Return or exchange within 30 days of purchase.",
                },
            };
            const response = await addNewProducts(data);
            enqueueSnackbar(response.message, {
                variant: response.success ? "success" : "error",
            });
            if (response.success) {
                push('/dashboard/products')
            }
        } else {
            enqueueSnackbar("Add atleast 3 images", {
                variant: "error",
            });
        }
        setLoading(false);
    };



    const listedColors = variation.map(vari => { return vari.color });
    const availableColors = Colors.filter((color) => !exist(listedColors, color.value))

    const onlySingleVariation = variation.filter((vari) => vari.color && vari.color.value === undefined)[0] !== undefined

    return (
        <React.Fragment>
            <Modal
                disableAutoFocus={true}
                className={classes.modal}
                open={openVariationSelect}
                onClose={() => setOpenVariationSelect(false)}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                closeAfterTransition
                disableBackdropClick
            >
                <Fade in={openVariationSelect}>
                    <div className={classes.paper}>

                        <Typography variant="subtitle1">
                            Select Color
                        </Typography>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                            fullWidth
                        >
                            <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                                variation
                            </InputLabel>
                            <Select
                                value={newVariant}
                                labelWidth={labelWidth}
                                inputProps={{
                                    name: "color",
                                    id: "outlined-category-simple",
                                }}
                                name="color"
                                onChange={(e) => setNewVariant(e.target.value)}
                            >
                                {availableColors.map((color) => {
                                    return (
                                        <MenuItem key={color.label} value={color} style={{ alignItems: 'center' }}>
                                            <div style={{ height: '10px', width: '10px', backgroundColor: color.value, marginRight: '10px' }}></div> {color.label}
                                        </MenuItem>
                                    )
                                })}

                            </Select>
                        </FormControl>

                        <Box style={{ marginTop: 12 }}>
                            <Button variant="outlined" color="primary" onClick={addNewVariation}>
                                Add
                            </Button>
                            <Button variant="outlined" color="secondary" style={{ marginLeft: 3 }} onClick={() => setOpenVariationSelect(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </div>
                </Fade>
            </Modal>
            <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
                <Card
                    style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingBottom: "1rem",

                    }}
                >
                    <Box style={{ display: "flex" }}>
                        <PageTitle title="Add New Product" />
                        <div
                            className={classes.action}
                            style={{ marginTOp: 0, lineHeight: 6 }}
                        >
                        </div>


                    </Box>

                    <Grid container className={classes.grid} spacing={4}>
                        <Grid item className={classes.box} xs={6} sm={6} md={6} lg={6}>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-name"
                                    label="Product Title"
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    value={product.title}
                                    name="title"
                                    onChange={handleChangeProductDetails}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Description"
                                    multiline
                                    rows="4"
                                    value={product.description}
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    name="description"
                                    onChange={handleChangeProductDetails}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Highlights"
                                    value={product.highlights}
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginBottom: 0 }}
                                    name="highlights"
                                    onChange={handleChangeProductDetails}
                                />
                                <Typography variant="caption" style={{ fontSize: "10px" }}>
                                    Comma(,) seprated string
                                </Typography>
                            </Grid>
                            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={3}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.formControl}
                                        fullWidth
                                    >
                                        <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                                            Category
                                        </InputLabel>
                                        <Select
                                            value={product.categoryId}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: "category",
                                                id: "outlined-category-simple",
                                            }}
                                            name="category"
                                            onChange={handleSelectCategory}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.formControl}
                                        fullWidth
                                    >
                                        <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                                            Collection
                                        </InputLabel>
                                        <Select
                                            value={product.collectionId}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: "collection",
                                                id: "outlined-category-simple",
                                            }}
                                            name="collection"
                                            onChange={handleSelectCollection}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {collections.map(collection => <MenuItem key={collection.id} value={collection.id}>{collection.title}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.box} xs={6} sm={6} md={6} lg={6}>
                            <Grid item container xs={12} sm={12} md={12} lg={12} spacing={3}>
                                <Grid item xs={3}>
                                    <FormControl
                                        variant="outlined"
                                        className={classes.formControl}
                                        fullWidth
                                    >
                                        <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                                            Currency
                                        </InputLabel>
                                        <Select
                                            value={product.currency}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: "currency",
                                                id: "outlined-category-simple",
                                            }}
                                            name="currency"
                                            onChange={handleChangeProductDetails}
                                        >
                                            <MenuItem value="INR">
                                                INR
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={7} sm={7} md={7} lg={7}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="MRP Price"
                                        value={product.price}
                                        onChange={handleChangeProductDetails}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        type="text"
                                        InputProps={{
                                            inputProps: { min: 1 },
                                        }}
                                        name="mrpPrice"
                                    />
                                </Grid>

                                <Grid item xs={7} sm={7} md={7} lg={7}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Selling Price"
                                        value={product.price}
                                        onChange={handleChangeProductDetails}
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        type="text"
                                        InputProps={{
                                            inputProps: { min: 1 },
                                        }}
                                        name="sellingPrice"
                                    />
                                </Grid>




                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ marginBottom: ".5em" }}>
                                    Available Sizes
                                </Typography>
                                <Grid item container xs={12} sm={12} md={12} lg={12} spacing={2}>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="XS"
                                            value={stock.XS}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="XS"
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="SM"
                                            value={stock.S}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="S"
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="MD"
                                            value={stock.M}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="M"
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="LG"
                                            value={stock.L}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="L"
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="XL"
                                            value={stock.XL}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="XL"
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} md={3} lg={3}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="XXL"
                                            value={stock.XXL}
                                            onChange={handleChangeStock}
                                            className={classes.textField}
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0 }}
                                            type="number"
                                            InputProps={{
                                                inputProps: { min: 0 },
                                            }}
                                            name="XXL"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item >
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={product.returnAndExchange} onChange={handleChecked} color="primary" />
                                    }
                                    label="Return and Exchange"
                                />
                            </Grid>
                        </Grid>


                        {variation.map((vrts, _vrIndex) => {
                            return (
                                <Grid item container md={12} lg={12} spacing={1} style={{
                                    paddingTop: '24px', paddingBottom: '24px'
                                }}>

                                    <Grid item md={6} lg={6}>
                                        <FormControl
                                            variant="outlined"
                                            className={classes.formControl}
                                            fullWidth
                                        >
                                            <InputLabel ref={inputLabel} htmlFor="outlined-category-simple">
                                                variation
                                            </InputLabel>
                                            <Select
                                                value={vrts.color}
                                                renderValue={(val) => val.label}
                                                labelWidth={labelWidth}
                                                inputProps={{
                                                    name: "color",
                                                    id: "outlined-category-simple",
                                                }}
                                                name="color"
                                                onChange={(e) => handleChangeVariation(_vrIndex, e.target.value)}
                                            >
                                                <MenuItem value={{ label: 'No Variation', value: undefined }}>
                                                    No Variation
                                                </MenuItem>
                                                {Colors.map((color) => {
                                                    return (
                                                        <MenuItem key={color.label} value={color} style={{ alignItems: 'center' }}>
                                                            <div style={{ height: '10px', width: '10px', backgroundColor: color.value, marginRight: '10px' }}></div> {color.label}
                                                        </MenuItem>
                                                    )
                                                })}

                                            </Select>
                                        </FormControl>

                                    </Grid>

                                    <Grid item md={6} lg={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        {!onlySingleVariation && variation.length > 1 && <Button variant="contained" color='secondary' onClick={() => removeVariation(_vrIndex)}>
                                            Remove Variation
                                        </Button>
                                        }
                                    </Grid>

                                    <Grid item md={12} lg={12}>
                                        <Typography variant="subtitle2">
                                            Showcase
                                        </Typography>
                                    </Grid>



                                    {Object.keys(vrts.showcase).map((key, _showCaseIndex) => {
                                        return (
                                            <Grid item md={2} lg={2} key={key}>
                                                <div className="upload-container">
                                                    {!vrts.showcase[key].data ? (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id={`showcase-${key}-${_vrIndex}`}
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(_vrIndex, _showCaseIndex, "showcase", e)}
                                                                name={`showcase-${key}-${_vrIndex}`}
                                                                className="inputFile"
                                                            />
                                                            <label htmlFor={`showcase-${key}-${_vrIndex}`} className="upload-button">
                                                                <div>
                                                                    <AddCircleOutlinedIcon style={{ fontSize: "80px" }} />
                                                                </div>
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <div style={{
                                                            width: "100px",
                                                            height: "160px",
                                                            position: 'relative'
                                                        }}>
                                                            <div style={{ position: "absolute", right: 0 }}>
                                                                <IconButton style={{ color: "black" }} onClick={() => removeImage(_vrIndex, _showCaseIndex, "showcase")}>
                                                                    <CancelIcon style={{ fontSize: "35px" }} />
                                                                </IconButton>
                                                            </div>
                                                            <img
                                                                src={vrts.showcase[key].data}
                                                                style={{
                                                                    width: "100px",
                                                                    height: "160px",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </Grid>
                                        )
                                    })}

                                    <Grid item md={12} lg={12}>
                                        <Typography variant="subtitle2">
                                            Product
                                        </Typography>
                                    </Grid>

                                    {Object.keys(vrts.product).map((key, _productIndex) => {
                                        return (
                                            <Grid item md={2} lg={2} key={key}>
                                                <div className="upload-container">
                                                    {!vrts.product[key].data ? (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id={`product-${key}-${_vrIndex}`}
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(_vrIndex, _productIndex, "product", e)}
                                                                name={`product-${key}-${_vrIndex}`}
                                                                className="inputFile"
                                                            />
                                                            <label htmlFor={`product-${key}-${_vrIndex}`} className="upload-button">
                                                                <div>
                                                                    <AddCircleOutlinedIcon style={{ fontSize: "80px" }} />
                                                                </div>
                                                            </label>
                                                        </>
                                                    ) : (
                                                        <div style={{
                                                            width: "100px",
                                                            height: "160px",
                                                            position: 'relative'
                                                        }}>
                                                            <div style={{ position: "absolute", right: 0 }}>
                                                                <IconButton style={{ color: "black" }} onClick={() => removeImage(_vrIndex, _productIndex, "product")}>
                                                                    <CancelIcon style={{ fontSize: "35px" }} />
                                                                </IconButton>
                                                            </div>
                                                            <img
                                                                src={vrts.product[key].data}
                                                                style={{
                                                                    width: "100px",
                                                                    height: "160px",
                                                                    objectFit: "contain",
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </Grid>
                                        )
                                    })}

                                </Grid>
                            )
                        })}

                        <Grid item md={12} lg={12}>
                            <Button variant="outlined" disabled={onlySingleVariation} endIcon={<AddIcon />} onClick={() => setOpenVariationSelect(true)}>
                                Add New Variant
                            </Button>
                        </Grid>

                        <Grid item md={12} lg={12}>
                            <Button disabled={loading} variant="contained" color="primary" size="large" onClick={handleAddProduct}>
                                Add
                            </Button>
                        </Grid>


                    </Grid>


                </Card>
            </Container>
        </React.Fragment>
    )
}