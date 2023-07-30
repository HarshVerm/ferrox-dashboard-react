import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PageTitle from '../Common/PageTitle';
import ColorsTable from './ColorsTable';

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

function ColorsPage(props) {
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="lg" >
            <Grid container spacing={2} >
                <Grid item lg={12}>
                    <PageTitle title="Colors" />
                    <ColorsTable />

                </Grid>

            </Grid>

        </Container>
    );
}

export default ColorsPage;