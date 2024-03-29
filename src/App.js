import React from 'react';
import './App.css';
import AppBarComponent from './Components/AppBarComponent';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import HomeComponent from './Components/HomeComponent';
import MenuComponent from './Components/MenuComponent';
import LoginComponent from './Components/LoginComponent';
import SignUpComponent from './Components/SignUpComponent';
import MyAccountComponent from './Components/MyAccountComponent';

import DashboardComponent from './Components/DashboardComponent'
import AccountsComponent from './Components/AccountsComponent'

export default function App() {

   return (
      <AuthProvider>
         <Router>
            <div className="App">
               <AppBarComponent/>
               {
                  //Public routes
               }
               <Route exact path="/Menu" component={MenuComponent}></Route>
               <Route exact path="/#VisitUs" component={HomeComponent}></Route>
               <Route exact path="/Login" component={LoginComponent}></Route>
               <Route exact path="/Signup" component={SignUpComponent}></Route>
               <Route exact path="/Account" component={MyAccountComponent}></Route>
               <Route exact path="/" component={HomeComponent}></Route>
               {
                  //Private routes
               }
               <PrivateRoute exact path="/Dashboard" component={DashboardComponent} />
               <PrivateRoute exact path="/Accounts" component={AccountsComponent} />
            </div>
         </Router>
      </AuthProvider>
    );
}
