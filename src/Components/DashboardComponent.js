import React, { useContext, useEffect, useState } from 'react';

import {AuthContext} from '../Auth'

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';

import firebase from '../firebase'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function DashboardComponent() {

   const classes = useStyles();

   const {currentUser} = useContext(AuthContext)

   const [ramens, setRamens] = useState([])

   useEffect(() => {
     const fetchData = async () => {
        const db = firebase.firestore()
        const data = await db.collection("ramens").orderBy('rating', 'desc').limit(3).get()
        setRamens(data.docs.map(doc => ({
           ...doc.data(),
           id: doc.id
        })))
     }
     fetchData()
   }, [])

  return (
     <div className={classes.root}>
     <h1>Welcome back {currentUser.fullName}!</h1>
      <Grid container>
        <Grid container spacing={3} justify="center">
          <Grid item xs={5}>
            <Paper className={classes.paper}>
               <h2>Highest rated ramen</h2>
               {ramens.map(ramen => (
                  <div key={ramen.id}>
                     <p>{ramen.name}</p>
                     <Rating name="read-only" value={ramen.rating} readOnly />
                  </div>
               ))}
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
               <h2></h2>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
