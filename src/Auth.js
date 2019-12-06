import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import app from "./firebase.js";

//Context allows us to propagate data throughout the whole component tree
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
     id: '',
     fullName: '',
     email: '',
     accountType: ''
 });

  useEffect(() => {
     app.auth().onAuthStateChanged(function(user) {
        if (user) {
           console.log(user.displayName);
          // User is signed in.
          //Check user accountType
          checkAccountType(user.uid).then(accountType =>{
             //Update current user
             setCurrentUser({
               id: user.uid,
               fullName: user.displayName,
               email: user.email,
               accountType: accountType
            })
         })
        } else {
          // No user is signed in.
          setCurrentUser({
             id: '',
             fullName: '',
             email: '',
             accountType:''
          })
        }
      });
  }, []);

  async function checkAccountType(userId){
     let accountType = ''
     const userRef = app.firestore().collection('users').doc(userId)
     await userRef.get().then(doc =>{
        accountType = doc.data().accountType
     })
     return accountType
 }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
