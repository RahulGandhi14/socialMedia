import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../authHelper";
import LandingPage from "./LandingPage";

const Home = () => (
  <Fragment>
    {isAuthenticated() ? <LandingPage /> : <Redirect to="/signin" />}
  </Fragment>
);

export default Home;
