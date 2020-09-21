import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated, signin, authenticate } from "../authHelper";
import Base from "../core/Base";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    // didRedirect: false,
  });

  const { email, password, error, loading } = values;
  // const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          //whenever there is a next in arg,we can call a callback
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true });
          });
        }
      })
      .catch((err) => console.log(`SIGNIN ERROR: ${err}`));
  };

  const performRedirect = () => {
    // if (didRedirect) {
    //   return <Redirect to="/user/profile" />;
    // }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading...</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger text-center"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => (
    <div>
      <div className="row">
        <div className="col-md-6 offset-sm-3">
          <form>
            <div className="form-group">
              <lable className="text-dark">Email</lable>
              <input
                onChange={handleChange("email")}
                className="form-control"
                value={email}
                type="email"
              />
            </div>
            <div className="form-group">
              <lable className="text-dark">Password</lable>
              <input
                onChange={handleChange("password")}
                className="form-control"
                value={password}
                type="password"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-primary btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Base>
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      {performRedirect()}
      <p className="text-center text-dark mt-2">
        <h5>
          New User? <Link to="/signup">Signup Here!</Link>
        </h5>
      </p>
      {/* <p className="text-dark text-center">{JSON.stringify(values)}</p> */}
    </Base>
  );
};

export default Signin;
