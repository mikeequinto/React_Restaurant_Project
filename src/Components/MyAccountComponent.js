import React, { useContext, useEffect, useState } from 'react';

import {AuthContext} from '../Auth'
import app from '../firebase'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

   const dbUser = app.

   const {currentUser} = useContext(AuthContext)

   const [updatedUser, setUpdatedUser] = useState({
      name: '',
      email: '',
      password: '',
      password2: ''
   })

   if(currentUser.id === ''){
      return <Redirect to="/" />;
   }

   function updateUser(){
      if(updatedUser.name !== ''){
         updateField('name', updatedUser.name)
      }
      if(updatedUser.password !== '' && updatedUser.password === updatedUser.password2){
         updateField('password', updatedUser.name)
      }else{
         alert('Please check your password')
      }
   }

   function updateField(field, value){

      //Modification du user dans firebase authentication
      app.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

       }
      });

      switch(field){
         case 'name':
            //Update name

         case 'password':
            //Update password
         default:
            return null
      }
   }

   function deleteUser(){

   }

   function handleChange(evt){
      setUpdatedUser({
         [evt.target.id] : evt.target.value
      })
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
         value={updatedUser.password} className={classes.textField}
         margin="normal" onChange={handleChange} />
         <br/>
         <TextField id="password2" label="Confirm Password" type="password" placeholder="*******"
         value={updatedUser.password2} className={classes.textField}
         margin="normal" onChange={handleChange} />
         <br/>
         <Button onClick={updateUser} variant="contained">Update</Button>
         <Button onClick={updateUser} variant="contained" color="secondary">Delete</Button>
       </form>
    </div>
  );
}
