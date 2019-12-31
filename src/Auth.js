import React, { useEffect, useState } from "react";
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
            //If displayName unknown, get it from firestore
            if(currentUser.fullName === ''){
               getDisplayName(user.uid)
            }
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
     try{
        const userRef = app.firestore().collection('users').doc(userId)
       await userRef.get().then(doc =>{
          accountType = doc.data().accountType
       })
       return accountType
    }catch(error){
      console.log(error);
   }

 }

 async function getDisplayName(userId){
    try{
      const userRef = app.firestore().collection('users').doc(userId)
      await userRef.get().then(doc =>{
        if(doc.exists){
           setCurrentUser(prevState => {
              return { ...prevState, fullName: doc.data().name }
           });
        }
      })
   }catch(error){
      console.log(error);
   }

}

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
