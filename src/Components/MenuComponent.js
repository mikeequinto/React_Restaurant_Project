import React, {useState, useEffect, useContext}from 'react'
import firebase, {storage} from '../firebase'

import { AuthContext } from '../Auth'

import MenuItemComponent from './MenuItemComponent'

//Styles
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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

export default function MenuComponent() {

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
   //Utilisateur actuelle
   const { currentUser } = useContext(AuthContext)
   //Affichage du form pour le nouveau ramen
   const [showRamen, setShowRamen] = useState(false)
   //New ramen
   const [ramen, setRamen] = useState({
      name: 'Ramen Name',
      price: 14.99,
      rating: 4.5,
   })
   //Ramen image
   const [image, setImage] = useState({
      file: null,
      name: 'Choose image',
   })
   //Alert lorsqu'on ajoute un ramen
   const [openUpdate, setOpenUpdate] = useState(false)
   //Alert lorsque l'utilisateur oubli de choisir une image
   const [openAlert, setOpenAlert] = useState(false)

   function handleChange(evt) {
      if(evt.target.id === 'file'){
         const image = evt.target.files[0]
         if(image){
            const imageName = image.name
            setImage({
               ...image,
               file: image,
               name: imageName,
            })
         }
      }else{
         setRamen({
             ...ramen,
             [evt.target.id]:evt.target.value,
         })
      }

   }

   function addRamen(event){
      event.preventDefault()
      //Ajout de l'image en premier, pour récupérer l'emplacement dans storage
      if(image.file !== null){
         uploadImage()
      }else{
         setOpenAlert(true)
      }
   }

   function addRamenToFirestore(url){
      //Ajout du ramen dans firestore
      const db = firebase.firestore().collection('ramens')
      // Add a new document with a generated id.
      db.add({
          ...ramen,
          imageUrl: url
      })
      .then(function(docRef) {
         //Ajout et affichage du ramen
          setRamens([
             ...ramens,
             { ...ramen,
               id: docRef.id,
               imageUrl: url
            }
         ])
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
   }

   async function uploadImage(){
      //Generate random file name
      const fileId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const uploadTask = storage.ref('images/' + fileId).put(image.file)
      await uploadTask.on(
         "state_changed",
         () => {
           // complete function ...
           storage
             .ref("images")
             .child(fileId)
             .getDownloadURL()
             .then(url => {
               addRamenToFirestore(url)
               setShowRamen(false)
               setOpenUpdate(true)
             });
         }
      )
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

   function removeRamen(index){
      var array = [...ramens]; // make a separate copy of the array
      if (index !== -1) {
       array.splice(index, 1);
       setRamens(array);
      }
   }

   function handleCloseUpdate(){
      setOpenUpdate(false);
   }

   function handleCloseAlert(){
      setOpenAlert(false);
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
                <TextField required id="price" label="Price (CHF)" type="number"
                value={ramen.price} className={classes.textField} margin="normal"
                  onChange={handleChange}
                  InputLabelProps={{
                     shrink: true,
                   }}
                />
                <br/>
                <input
                  accept="image/*" className={classes.input}
                  style={{ display: 'none' }} id="file"
                  type="file"  value={ramen.file} onChange={handleChange}
               />
               <label htmlFor="file">
                 <Button variant="contained" component="span" className={classes.button}>
                   Upload
                 </Button>
               </label>
               <span> </span>{image.name}
            </form>
            <Box m={2}>
               <Button onClick={addRamen} variant="contained" color="primary">Submit ramen</Button>
            </Box>
         </div> : null
      }
      {
         //Affichage du dialog lors d'un ajout de ramen
      }
      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            New ramen has been added!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {
         //Affichage du dialog si l'utilisateur n'a pas choisi d'image
      }
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please choose an image
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3}>
         {ramens.map(ramen => (
            <Grid item xs={6} sm={4} key={ramen.id}>
               <MenuItemComponent ramenindex={ramens.indexOf(ramen)} ramen={ramen} removeRamen={removeRamen}/>
            </Grid>
         ))}
      </Grid>
    </div>
  );
}
