import React, { useContext, useEffect, useState } from 'react';

import {AuthContext} from '../Auth'
import app from '../firebase'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
   },
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
   },
}));

export default function MyAccountComponent() {

   const classes = useStyles();

   //Pour afficher ou non la fenêtre de confirmation
   const [openDelete, setOpenDelete] = useState(false)
   //Utilisateur dans firestore
   const userRef = app.firestore().collection('users')
   //Utilisateur actuellement connecté
   const {currentUser, setCurrentUser} = useContext(AuthContext)
   //Variable permettant de savoir si une modification a été effectué
   const [accountUpdated, setAcccountUpdated] = useState(false)
   //Champs du form
   const [updatedUser, setUpdatedUser] = useState({
      name: '',
      password: '',
      password2: ''
   })

   if(currentUser.id === ''){
      return <Redirect to="/" />;
   }

   function updateUser(){

      //Pour afficher l'alert dés que le compte a été modifié
      var updated = false

      //Si le champ name n'est pas vide
      if(updatedUser.name !== ""){
         updateField('name', updatedUser.name)
         updated = true
      }
      //Si les champs passwords ne sont pas vide
      if(updatedUser.password !== ""){
         if(updatedUser.password.length > 5){
            if(updatedUser.password == updatedUser.password2){
               updateField('password', updatedUser.password)
               updated = true
            }else{
               alert('Your passwords do not match')
            }
         }else{
            alert("Your password must be at least 6 characters long")
         }
      }
      //Affichage de l'alert si une modification a été effectué
      if(updated){
         alert("Your account has been updated!")
      }
   }

   function updateField(field, value){

      try{
         //Modification du user dans firebase authentication
         app.auth().onAuthStateChanged(function(user) {
           if (user) {
             // User is signed in.
             switch(field){
                case 'name':
                  //Update name in firebase auth
                  user.updateProfile({
                     displayName: value,
                  })
                  //Update name in firestore
                  userRef.doc(currentUser.id).update({
                     name: value
                  })
                  //Updated current user
                  setCurrentUser({
                     ...currentUser,
                     fullName: value
                  })
                  break
                case 'password':
                   //Update password
                   user.updatePassword(value)
                   break
                default:
                   return null
                   break
             }
          }
         })
      }catch(error){
         alert(error);
      }
   }

   function handleChange(evt){
      setUpdatedUser({
         ...updatedUser,
         [evt.target.id] : evt.target.value
      })
   }

   function deleteAccount(){
      var user = app.auth().currentUser;
      //Delete du compte dans firestore
      userRef.doc(currentUser.id).delete().then(function() {
         console.log("Document successfully deleted!");
      }).catch(function(error) {
         console.error("Error removing document: ", error);
      });
      //Delete du compte dans authentication
      if(user){
         user.delete().then(function() {
            alert("Your account has been deleted")
         }).catch(function(error) {
           // An error happened.
           alert(error)
         });
      }
   }

   function handleDelete(){
      //Fonction qui ouvre et ferme la fenêtre de confirmation
      if(openDelete === false){
         setOpenDelete(true)
      }else{
         setOpenDelete(false)
      }
   }

  return (
    <div>
      <h1>My Account</h1>
       <form>
         <TextField id="name" label="Name"
         value={updatedUser.name} className={classes.textField} placeholder={currentUser.fullName}
         margin="normal" onChange={handleChange} />
         <br/>
         <TextField id="password" label="New Password" type="password" placeholder="*******"
         value={updatedUser.password} className={classes.textField} autoComplete="off"
         margin="normal" onChange={handleChange} />
         <br/>
         <TextField id="password2" label="Confirm Password" type="password" placeholder="*******"
         value={updatedUser.password2} className={classes.textField} autoComplete="off"
         margin="normal" onChange={handleChange} />
         <br/>
         <Button onClick={updateUser} variant="contained">Update</Button>
         <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
         <Dialog
           open={openDelete}
           onClose={handleDelete}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">{"Delete account"}</DialogTitle>
           <DialogContent>
              <DialogContentText id="alert-dialog-description">
               Are you sure you want to delete your account?
              </DialogContentText>
           </DialogContent>
           <DialogActions>
             <Button color="secondary" onClick={deleteAccount}>Yes</Button>
             <Button onClick={handleDelete}>No</Button>
           </DialogActions>
         </Dialog>
       </form>
    </div>
  );
}
