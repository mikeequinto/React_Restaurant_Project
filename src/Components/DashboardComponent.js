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
        getBestRamen()
        //Récupération des derniers ratings
        getRatings()
     }
     fetchData()
   }, [])

   async function getBestRamen(){
      const data = await db.collection("ramens").orderBy('rating', 'desc').limit(3).get()
      setRamens(data.docs.map(doc => ({
         ...doc.data(),
         id: doc.id
      })))
   }

   async function getRatings(){
      const data2 = await db.collection("ratings").orderBy('dateTime', 'desc').limit(3).get()
      setRatings(data2.docs.map(doc => ({
         ...doc.data(),
         id: doc.id,
         username: '',
         ramenName: ''
      })))
   }

   function getUserName(rating){
      //récupération de l'index du rating dans ratings
      var index = ratings.findIndex(x => x.id === rating.id);
      //Récupération du rating
      var ratingObject = ratings[index]
      //Récupération du nom de l'utilisateur dans firestore
      var docRef = db.collection("users").doc(rating.userId);

      docRef.get().then(function(doc) {
          if (doc.exists) {
              let newArr = [...ratings]
              newArr[index].username = doc.data().name
              setRatings(newArr)
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

   }

   function getRamen(rating){
      //récupération de l'index du rating dans ratings
      var index = ratings.findIndex(x => x.id === rating.id);
      //Récupération du rating
      var ratingObject = ratings[index]
      //Récupération du nom du ramen
      var docRef = db.collection("ramens").doc(rating.ramenId);

      docRef.get().then(function(doc) {
          if (doc.exists) {
             let newArr = [...ratings]
             newArr[index].ramenName = doc.data().name
             setRatings(newArr)
          } else {
              // doc.data() will be undefined in this case
              let newArr = [...ratings]
              newArr[index].ramenName = "Unknown ramen"
              setRatings(newArr)
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
                     {
                        //Récupération du nom du ramen
                        rating.ramenName === '' ?
                        getRamen(rating) : null
                     }
                     {
                        //Récupération du nom de l'utilisateur
                        rating.username === '' ?
                        getUserName(rating) : null
                     }
                     <p>{rating.ramenName} by {rating.username}</p>
                     <Rating name="read-only" value={rating.rating} readOnly />
                  </div>
               ))}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>

  );
}
