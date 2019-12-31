import React, { useState } from 'react';

import firebase from '../../firebase'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AccountButton(props) {

   //Pour afficher ou non la fenêtre de confirmation
   const [openDelete, setOpenDelete] = useState(false)

   const dbUsers = firebase.firestore().collection('users')

   function changeType(){
      //Changement du type de compte de l'utilisateur
      dbUsers.doc(props.account.id).get().then(doc => {
         var newType = doc.data().accountType
         if(newType === 'client'){
            newType = 'admin'
         }else{
            newType = 'client'
         }
         //Mise à jour dans la base de données
         dbUsers.doc(props.account.id).update({
            accountType: newType
         })
         //Mise à jour de l'affichage des comptes
         props.updateAccounts(props.action, props.accountIndex, newType)
      })
   }

   function deleteAccount(){
      //Delete du compte de l'utilisateur
      dbUsers.doc(props.account.id).delete().then(doc => {
         //Mise à jour de l'affichage des comptes
         props.updateAccounts(props.action, props.accountIndex)
         handleDelete()
      })
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
      {props.action === 'changeType' ?
         <div>
            <Button color="primary" onClick={changeType}>Change</Button>
         </div>
         :
         <div>
            <Button color="secondary" onClick={handleDelete} m={2}>Delete</Button>
         </div>
      }
        <Dialog
          open={openDelete}
          onClose={handleDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete account"}</DialogTitle>
          <DialogContent>
             <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {props.account.name}?
             </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={deleteAccount}>Yes</Button>
            <Button onClick={handleDelete}>No</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}
