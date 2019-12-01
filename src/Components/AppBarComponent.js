import React, {useContext} from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";

import { AuthContext } from '../Auth'

import app from '../firebase'

export default function AppBarComponent(props) {

  const { currentUser } = useContext(AuthContext)

  function isAdmin(){
     if(currentUser.accountType === 'admin'){
        return true
     }
     return false;
 }

  return (
    <div>

      <AppBar position="static">
        <Toolbar>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/Menu">Menu</Button>
            <Button color="inherit" component={Link} to="/Contact">Contact</Button>
            { //Ajout des fonctionnalités admin si l'utilisateur a accès
               isAdmin() ?
               <div>
                  <Button color="inherit" component={Link} to="/Admin">Dashboard</Button>
                  <Button color="inherit" component={Link} to="/Accounts">Accounts</Button>
               </div> : null
            }
            { currentUser.id === '' ? <Button color="inherit" component={Link} to="/Login">Login</Button> : null }
            { currentUser.id !== '' ? <Button color="inherit" onClick={signOut}>Log out</Button> : null}
        </Toolbar>
      </AppBar>
    </div>
  );

  function signOut(){
      app.auth().signOut()
      console.log('logging out');
  }
}
