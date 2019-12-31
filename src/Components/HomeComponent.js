import React, { useState, useEffect } from 'react';

import firebase, {storage} from '../firebase'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import { sizing } from '@material-ui/system';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function HomeComponent() {

   const classes = useStyles();

   const [restaurantImage, setRestaurantImage] = useState('')
   const [ramens, setRamens] = useState([])

   const db = firebase.firestore()

   useEffect(() => {
      const fetchData = async () => {
         //Récupération de l'image de fond
         getRestaurantImage()
         //Récupération des meilleures produits
         getBestRamen()
      }
      fetchData()
   }, [])

   function getRestaurantImage(){
      storage.ref().child("images/restaurantImage.png").getDownloadURL().then(function(url) {
         setRestaurantImage(url)
      })
   }

   async function getBestRamen(){
      const data = await db.collection("ramens").orderBy('rating', 'desc').limit(3).get()
      setRamens(data.docs.map(doc => ({
         ...doc.data(),
         id: doc.id
      })))
   }

   //Css style
   const container = {
      textAlign: "center",
      color: "white",
   }
   const divStyleFirst = {
      width: "100%",

   }
   const centered = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "5em"
   }
   const bestRamen = {
      padding: "60px"
   }
   const information = {
      backgroundColor: "#E7E4E4",
      padding: "30px"
   }

  return (
    <div>
      <div style={container}>
         <img src={restaurantImage} alt="restaurant image" style={divStyleFirst} />
      </div>
      <div style={bestRamen}>
         <h1>Try our most popular ramen</h1>
          <Grid container spacing={3} justify="center">

            {ramens.map(ramen => (
               <Grid item key={ramen.id} xs={3}>
                  <img src={ramen.imageUrl} alt={ramen.name} width="100%" height="175px"/>
                  <h3>{ramen.name}</h3>
                  <Rating name="read-only" value={ramen.rating} readOnly />
               </Grid>
            ))}
          </Grid>
      </div>
      <div id="VisitUs" style={information}>
         <h1>Come dine in</h1>
         <h3>HOURS & LOCATION</h3>
         <Grid container spacing={3} justify="center">
            <Grid item xs={3}>
               <p>Mon - Fri</p>
               <p>11am - 9pm</p>
            </Grid>
            <Grid item xs={3}>
               <p>Saturday</p>
               <p>12am - 6pm</p>
            </Grid>
            <Grid item xs={3}>
               <p>Sunday</p>
               <p>12am - 5pm</p>
            </Grid>
         </Grid>
         <Grid container spacing={3} justify="center">
            <Grid item xs={5}>
               <h3>Ichiraku's ramen bar</h3>
               <p>27 rue de la gare</p>
               <p>Genève 1207</p>
               <p>+22 458 56 22</p>
            </Grid>
            <Grid item xs={5}>
               <h3>Follow us</h3>
               <Grid container spacing={1} justify="center">
                  <Grid item xs={3}>
                     <img src={require("../ressources/icons/social-media/png/facebook.png")} width="50px"/>
                  </Grid>
                  <Grid item xs={3}>
                     <img src={require("../ressources/icons/social-media/png/instagram.png")} width="50px"/>
                  </Grid>
                  <Grid item xs={3}>
                     <img src={require("../ressources/icons/social-media/png/twitter.png")} width="50px"/>
                  </Grid>
               </Grid>
            </Grid>
         </Grid>
      </div>
    </div>
  );
}
