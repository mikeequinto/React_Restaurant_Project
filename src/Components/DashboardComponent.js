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
   const [ratings, setRatings] = useState([])

   const db = firebase.firestore()

   useEffect(() => {
     const fetchData = async () => {
        //Récupération des meilleures produits
        const data = await db.collection("ramens").orderBy('rating', 'desc').limit(3).get()
        setRamens(data.docs.map(doc => ({
           ...doc.data(),
           id: doc.id
        })))
        //Récupération des derniers ratings
        const data2 = await db.collection("ratings").orderBy('dateTime', 'desc').limit(3).get()
        setRatings(data2.docs.map(doc => ({
           ...doc.data(),
           id: doc.id,
        })))
     }
     fetchData()
   }, [])

   function getUserName(id){
      //return db.collection('users').doc(id).get()

      var username = "hi"

      var docRef = db.collection("users").doc(id);

      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log(doc.data().name);
              username = doc.data().name
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      return username
   }

   function getRamen(id){
      //return db.collection('ramens').doc(id).get('name')

      var docRef = db.collection("ramens").doc(id);

      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log(doc.data().name);
              return doc.data().name
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
   }

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
               <h2>Latest user ratings</h2>
               {ratings.map(rating => (
                  <div key={rating.id}>
                     <p>{rating.rating}</p>
                     <Rating name="read-only" value={rating.rating} readOnly />
                     <p>{rating.userName}</p>
                     <p>{rating.ramenName}</p>
                  </div>
               ))}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
