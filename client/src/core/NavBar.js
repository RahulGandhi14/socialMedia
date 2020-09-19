import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../authHelper";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#0000FF" };
  } else {
    return { color: "#000000" };
  }
};

const NavBar = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-light">
      <li className="nav-item">
        <Link style={currentTab(history, "/")} className="nav-link" to="/">
          Home
        </Link>
      </li>
      {isAuthenticated() && (
        <li className="nav-item">
          <Link
            style={currentTab(history, "/user/profile")}
            className="nav-link"
            to="/user/profile"
          >
            My Account
          </Link>
        </li>
      )}
      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link
              style={currentTab(history, "/signup")}
              className="nav-link"
              to="/signup"
            >
              Signup
            </Link>
          </li>
          <li className="nav-item">
            <Link
              style={currentTab(history, "/signin")}
              className="nav-link"
              to="/signin"
            >
              Signin
            </Link>
          </li>
        </Fragment>
      )}
      {isAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link text-warning"
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  </div>
);

export default withRouter(NavBar);
