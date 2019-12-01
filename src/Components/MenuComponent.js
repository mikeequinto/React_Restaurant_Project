import React, {useState, useEffect, useContext}from 'react'
import firebase from '../firebase'

import { AuthContext } from '../Auth'

import MenuItemComponent from './MenuItemComponent'

//Styles
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
   spacing: 8,
   container: {
      display: 'flex',
      flexWrap: 'wrap',
   },
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
   },
}));

export default function HomeComponent() {

   const classes = useStyles();

   const [ramens, setRamens] = useState([])

   useEffect(() => {
      const fetchData = async () => {
         const db = firebase.firestore()
         const data = await db.collection("ramens").get()
         setRamens(data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
         })))
      }
      fetchData()
   }, [])

   //fonctionnalités admin

   const { currentUser } = useContext(AuthContext)

   const [showRamen, setShowRamen] = useState(false)

   const [ramen, setRamen] = useState({
      name: '',
      price: 10,
      image: '',
      rating: 4.5,
      description: ''
   })

   function handleChange(evt) {
     setRamen(
       {
         ...ramen,
         [evt.target.id]:evt.target.value,
       })
   }

   function addRamen(event){
      event.preventDefault()

      const db = firebase.firestore().collection('ramens')
      // Add a new document with a generated id.
      db.add({
          ramen.data()
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          setRamens({
             ...ramens,
             ramen,
             id: docRef.id
          })

      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
   }

   function isAdmin(){
      if(currentUser.accountType === 'admin'){
         return true
      }
      return false
   }

   function toggleRamen(){
      if(showRamen){
         setShowRamen(false)
      }else{
         setShowRamen(true)
      }
   }

  return (
    <div className={classes.root}>
      <h1>Menu</h1>
      { //Si utilisateur est admin
         isAdmin() ?
         <Box m={2}>
            <Button onClick={toggleRamen} variant="contained">Add ramen</Button>
         </Box> : null
      }
      {//Si l'admin veut ajouter un ramen
         showRamen ?
         <div>
            <form>
               <TextField required id="name" label="Name"
               value={ramen.name} className={classes.textField}
               margin="normal" onChange={handleChange}
                />
                <TextField required id="price" label="Price" type="number"
                value={ramen.price} className={classes.textField} margin="normal"
                  onChange={handleChange}
                  InputLabelProps={{
                     shrink: true,
                   }}
                />
            </form>
            <Box m={2}>
               <Button onClick={addRamen} variant="contained" color="primary">Submit ramen</Button>
            </Box>
         </div> : null
      }
      <Grid container>
         {ramens.map(ramen => (
            <Grid item xs={6} sm={4} key={ramen.id}>
               <MenuItemComponent ramen={ramen}/>
            </Grid>
         ))}
      </Grid>
    </div>
  );
}
