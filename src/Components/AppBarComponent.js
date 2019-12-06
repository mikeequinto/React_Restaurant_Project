import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";

import MenuListComposition from './AppBar/MenuListComposition'

import { AuthContext } from '../Auth'


export default function AppBarComponent(props) {

   const {currentUser} = useContext(AuthContext)

  return (
    <div>

      <AppBar position="static">
        <Toolbar>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/Menu">Menu</Button>
            <Button color="inherit" component={Link} to="/Contact">Contact</Button>
            { //Ajout des fonctionnalités admin si l'utilisateur a accès
               currentUser.accountType === 'admin' ?
               <div>
                  <Button color="inherit" component={Link} to="/Admin">Dashboard</Button>
                  <Button color="inherit" component={Link} to="/Accounts">Accounts</Button>
               </div> : null
            }
            { currentUser.id === '' ? <Button color="inherit" component={Link} to="/Login">Login</Button> : null }
            { // remplacement du bouton log in par le nom de l'utilisateur
               currentUser.id !== '' ? <MenuListComposition /> : null
            }
        </Toolbar>
      </AppBar>
    </div>
  );
}
