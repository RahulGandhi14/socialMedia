import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import PrivateRoute from "./authHelper/PrivateRoute";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Signup from "./user/Signup";
import Feed from "./core/Feed";
import UpdateUser from "./user/helper/UpdateUser";
import Home from "./core/Home";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/profile" exact component={Profile} />
        <PrivateRoute
          path="/user/update/:userId"
          exact
          component={UpdateUser}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
