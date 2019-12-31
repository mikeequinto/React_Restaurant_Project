import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {
  Link
} from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

import MenuListComposition from './AppBar/MenuListComposition'

import { AuthContext } from '../Auth'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    color: '#D28114',
},
   menu: {
      alignSelf: 'flex-end'
   }
}));

export default function AppBarComponent(props) {

   const classes = useStyles();

   const {currentUser} = useContext(AuthContext)

  return (
    <div>

      <AppBar position="static" className={classes.root}>
        <Toolbar className={classes.menu}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/Menu">Menu</Button>
            <Button color="inherit" component={HashLink} to="/#VisitUs">Visit Us</Button>
            { //Ajout des fonctionnalités admin si l'utilisateur a accès
               currentUser.accountType === 'admin' ?
               <div>
                  <Button color="inherit" component={Link} to="/Dashboard">Dashboard</Button>
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
