import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./authHelper/PrivateRoute";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Signup from "./user/Signup";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Feed} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/profile" exact component={Profile} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
