import React, {useState, useContext, useEffect}from 'react'
import firebase from '../firebase'

import {AuthContext} from '../Auth'

import MenuComponent from './MenuComponent'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function MenuItemComponent(props) {

   const classes = useStyles();

   const {currentUser} = useContext(AuthContext)

   //Rating du ramen (moyenne de tous les ratings)
   const [rating, setRating] = useState(props.ramen.rating)
   //Rating de l'utilisateur
   const [userRating, setUserRating] = useState()
   //Ratings de tous les utilisateurs (pour calculer la nouvelle moyenne)
   const [ratings, setRatings] = useState([])
   //Données du ramen depuis firestore
   const dbRamen = firebase.firestore().collection('ramens').doc(props.ramen.id)
   //Collection des ratings des utilisateurs depuis firestore
   const dbRatings = firebase.firestore().collection('ratings')

   //Ramen image (stock image)
   const [ramenImage, setRamenImage] = useState('http://via.placeholder.com/250x175')

   useEffect(() => {
      const fetchData = async () => {
         //Récupération de tous les ratings
         const data = await dbRatings.where("ramenId", "==", props.ramen.id).get()
         setRatings(data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
         })))
      }
      fetchData()
   }, [])

   function submitRating(){
      try{
         //Sauvegarde du rating de l'utilisateur
         updateUserRating()
         //Calcul de la nouvelle moyenne des ratings du ramen
         calculateRamenRating()
      }catch(error){
         alert(error)
      }
   }

   function updateUserRating(){
      //Ajout du nouveau rating dans firestore avec un nouvel id
      dbRatings.add({
          userId: currentUser.id,
          ramenId: props.ramen.id,
          dateTime: new Date(),
          rating: userRating
      })
      //Ajout du rating dans ratings
      setRatings(ratings =>[
         ...ratings,
         {
            userId: currentUser.id,
            rating: userRating
         }
      ])
   }

   function calculateRamenRating(){
      let total = parseFloat(userRating)
      //Récupération des ratings du ramen
      ratings.map(rating => (
         total += parseFloat(rating.rating)
      ))
      //Calcul de la moyenne
      const newRating = total / (ratings.length + 1)
      //Mise à jour du nouveau rating du ramen
      updateRamenRating(newRating)
   }

   function updateRamenRating(newRating){
      //Mise à jour du rating du ramen
      setRating(newRating)
      //Mise à jour dans firestore
      dbRamen.update({
         rating: newRating
      })
   }

   //FONCTIONNALITEES ADMIN

   //Alert lorsqu'on update le ramen
   const [openUpdate, setOpenUpdate] = useState(false);
   //Alert lorsqu'on delete le ramen
   const [openDelete, setOpenDelete] = useState(false);

   //State pour les changements du ramen
   const [ramen, setRamen] = useState({
      name: props.ramen.name,
      price: props.ramen.price
   })

   function handleRamenChange(evt) {
      //Sauvegarde des changements dans les champs du ramen
     setRamen(
       {
         ...ramen,
         [evt.target.id]:evt.target.value,
       })
   }

   function updateRamen(){
      //Mise à jour dans firestore
      dbRamen.update({
         name: ramen.name,
         price: ramen.price
      })
      setOpenUpdate(true);
   }

   function deleteRamen(){
      dbRamen.delete().then(function() {
         props.removeRamen(props.ramenindex)
          setOpenDelete(false);
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
   }

   function openDeleteRamen(){
      setOpenDelete(true)
   }

   function handleCloseUpdate(){
      setOpenUpdate(false);
   }

   function handleCloseDelete(){
      setOpenDelete(false);
   }

   function userAlreadyRated(){
      //Check si ratings contient l'id de l'utilisateur
      if(currentUser.id !== ''){
         return ratings
         .some(rating => currentUser.id === rating.userId)
      }
      return true
   }

   function isAdmin(){
      //Possibilité de modifier le menu si admin
      if(currentUser.accountType === 'admin'){
         return true
      }
      return false;
  }

  return (
    <div>
      <img src={ramenImage} alt='ramen' /><br/>
      {//Si admin, il peut modifier le nom et le prix du ramen
         isAdmin() ?
         <div>
            <input type="text" id="name" value={ramen.name}
            placeholder={props.ramen.name} onChange={handleRamenChange}/><br/>
            <input type="text" id="price" value={ramen.price}
            placeholder={props.ramen.price} onChange={handleRamenChange}/><br/>
            <Button onClick={updateRamen} variant="contained">Update</Button>
            <Button onClick={openDeleteRamen} variant="contained" color="secondary">Delete</Button>
         </div>
         :
         <div>
            <h2>{props.ramen.name}</h2>
            <p>Price : {props.ramen.price} CHF</p>
         </div>
      }
      <Box component="fieldset" mb={1} borderColor="transparent">
         {
            !userAlreadyRated() ?
              <Rating name="simple-controlled" value={rating}
                  onChangeActive={(event, newValue) => {
                     setUserRating(newValue)
                  }}
                onClick={submitRating} /> :
            <Rating name="read-only" value={rating} readOnly />
        }
      </Box>
      {
         //Affichage du dialog lors d'un update
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
            Ramen has been updated!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {
         //Affichage du dialog lors d'un Delete
      }
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete ramen"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {props.ramen.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
         <Button onClick={deleteRamen} color="secondary">Yes</Button>
         <Button onClick={handleCloseDelete}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
