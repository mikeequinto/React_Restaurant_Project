import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={ routeProps =>
        currentUser.accountType !== 'admin' ? (
           <Redirect to={"/"} />
        ) : (
           <RouteComponent {...routeProps} />
        )
      }
    />
  );
};

export default PrivateRoute
