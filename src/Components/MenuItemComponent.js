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

   //Rating de ramen (moyenne de tous les ratings)
   const [rating, setRating] = useState(props.ramen.rating)
   //Ratings de l'utilisateur
   const [userRating, setUserRating] = useState(5)
   //Ratings de tous les utilisateurs
   const [ratings, setRatings] = useState([])

   //Données du ramen
   const dbRamen = firebase.firestore().collection('ramens')
   .doc(props.ramen.id)
   //Collection des ratings des utilisateurs
   const dbRatings = firebase.firestore().collection('ratings')
   .doc(props.ramen.id).collection('userRatings')

   //Ramen image
   const [ramenImage, setRamenImage] = useState('http://via.placeholder.com/250x175')

   useEffect(() => {
      const fetchData = async () => {
         //Récupération de tous les ratings
         const data = await dbRatings.get()
         setRatings(data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
         })))
      }
      fetchData()
   }, [])

   function handleRatingChange(event) {
     setUserRating(event.target.value)
   }

   async function submitRating(event){
      event.preventDefault()
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
      //Ajout du nouveau rating dans firestore
      dbRatings.doc(currentUser.id).set({
         rating: userRating
      })
      //Ajout du rating dans ratings
      setRatings(ratings =>[
         ...ratings,
         {
            id: currentUser.id,
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

   //fonctionnalités admin

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
         .some(rating => currentUser.id === rating.id)
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
      {//Si admin, il peut modifier le nom et le prix du ramen
         isAdmin() ?
         <div>
            <img src={ramenImage} alt='ramen' /><br/>
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
            <img src={ramenImage} alt='ramen' /><br/>
            <p> Price : {props.ramen.price}</p>
            <p>Rating : {rating}</p>
         </div>
      }
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
      {//L'utilisateur peut seulement rate une fois
       //doit être connecté
         !userAlreadyRated()  ?
         <div>
            <input
               type="number"
               id="userRating"
               value={userRating}
               onChange={handleRatingChange}
            />
            <button onClick={submitRating}>submit</button>
         </div>
         : null
      }
    </div>
  );
}
