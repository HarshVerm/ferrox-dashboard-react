import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import addNewCategory from '../services/addCategory';
import { enqueueSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginRight: theme.spacing(1),
    width: '375px'
  },
  typeField: {
    marginLeft: theme.spacing(1),
    width: '175px'
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
    boxShadow: 'none',
  },
  title: {
    fontFamily: 'ApercuMedium',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
}));



export default function AddCategory(props) {
  const classes = useStyles();

  const [category,setCategory] = useState('')

  const handleChangeCategoryTitle = (event)=>{
    if(event.target.value.length < 50){
      setCategory(event.target.value)
    }
  } 

  const addCategory = async()=>{

    if(category.length > 2 ){
      const response = await addNewCategory(category)
      enqueueSnackbar(response.message, {
        variant: response.success ? 'success' : 'error'
      })
    }else{
      enqueueSnackbar('Category length should be greater or equal 3 character', {
        variant: "error"
      })
    }
  }
 

  return (
    <div style={{maxWidth:"80vw", minWidth:"400px"}}>
      <Typography variant="h5" className={classes.title}>Add New Category</Typography>
      <TextField
            id="outlined-name"
            label="Category"
            margin="normal"
            variant="outlined"
            fullWidth
            value={category}
            name="category"
            onChange={handleChangeCategoryTitle}
          />
      <Box display="flex" justifyContent="flex-end" style={{ marginTop: '2em' }}>
        <Button vsize="small" color="primary" className={classes.button} style={{ marginRight: 10 }} onClick={props.onClose} >
          Cancel
        </Button>
        <Button variant="contained" color="primary" className={classes.button} onClick = {addCategory}>
          Add
        </Button>
      </Box>

    </div>
  );
}