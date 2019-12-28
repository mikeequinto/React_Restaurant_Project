import React, { useContext, useState, useEffect } from 'react';

import {AuthContext} from '../Auth'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import AccountButton from './MyAccount/AccountButton'

import firebase from '../firebase'

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
});


export default function AccountsComponent() {

   const classes = useStyles();

   const [accounts, setAccounts] = useState([])

   //Firestore collection users
   const dbUsers = firebase.firestore().collection('users')

   useEffect(() => {
      const fetchData = async () => {
         const db = firebase.firestore()
         const data = await db.collection("users").orderBy('name').get()
         setAccounts(data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
         })))
      }
      fetchData()
   }, [])

   function updateAccounts(action,index,newType){
      //Mise à jour de l'affichage des comptes
      var array = [...accounts]; // make a separate copy of the array

      if (action === 'deleteAccount') {
         //On enlève l'account de la liste
         array.splice(index, 1);
         //handleDelete()
      }else{
         //On change l'account qui se trouve à l'index du account à modifier
         var newAccount = accounts[index]
         newAccount.accountType = newType
         array[index] = newAccount
      }
      setAccounts(array);
   }

  return (
     <div>
         <h1>Accounts</h1>
         <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Account type</TableCell>
                  <TableCell align="right">Change type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell component="th" scope="row">
                      {account.name}
                    </TableCell>
                    <TableCell align="right">{account.email}</TableCell>
                    <TableCell align="right">{account.accountType}</TableCell>
                    <TableCell align="right">
                       <AccountButton action="changeType" account={account}
                       accountIndex={accounts.indexOf(account)} updateAccounts={updateAccounts} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
     </div>
  );
}
