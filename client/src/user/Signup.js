import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../authHelper";
import Base from "../core/Base";

const Signup = () => {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    photo: "",
    city: "",
    error: "",
    success: false,
    formData: new FormData(),
  });

  const {
    firstname,
    lastname,
    email,
    password,
    city,
    error,
    success,
    formData,
  } = values;

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
    // console.log(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup(formData)
      .then((data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          if (data == "undefined") {
            console.log("IN_ELSE IF PART", data);
            setValues({
              ...values,
              firstname: "",
              lastname: "",
              email: "",
              password: "",
              city: "",
              error: "",
              success: true,
            });
          } else {
            setValues({
              ...values,
              error: "DB ISN'T CONNECTED",
              success: false,
            });
          }
        }
      })
      .catch((err) => console.log(`SIGNUP ERROR: ${error}`));
  };

  const signUpForm = () => (
    <div>
      <div className="row">
        <div className="col-md-6 offset-sm-3">
          <form>
            <div className="form-group">
              <lable className="text-dark">Select Photo</lable>
              <label className="btn btn-block btn-info">
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  name="photo"
                  accept="image"
                  placeholder="choose a file"
                />
              </label>
            </div>
            <div className="form-group">
              <lable className="text-dark">First-Name</lable>
              <input
                type="text"
                onChange={handleChange("firstname")}
                className="form-control"
                value={firstname}
              />
            </div>
            <div className="form-group">
              <lable className="text-dark">Last-Name</lable>
              <input
                type="text"
                onChange={handleChange("lastname")}
                className="form-control"
                value={lastname}
              />
            </div>
            <div className="form-group">
              <lable className="text-dark">Email</lable>
              <input
                type="email"
                onChange={handleChange("email")}
                className="form-control"
                value={email}
              />
            </div>
            <div className="form-group">
              <lable className="text-dark">Password</lable>
              <input
                type="password"
                onChange={handleChange("password")}
                className="form-control"
                value={password}
              />
            </div>
            <div className="form-group">
              {/* <lable className="text-dark">City</lable> */}
              <select onChange={handleChange("city")} className="form-control">
                <option value="">Select City</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Rajkot">Rajkot</option>
              </select>
            </div>

            <button onClick={onSubmit} className="btn btn-primary btn-block">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success text-center"
            style={{ display: success ? "" : "none" }}
          >
            <h5>
              New account is successfully created. Please{" "}
              <Link to="/signin">Login Here</Link>
            </h5>
          </div>
        </div>
      </div>
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

  return (
    <Base>
      {successMessage()}
      {errorMessage()}
      {signUpForm()}

      <h5 className="text-center mt-2">
        Already have an account? <Link to="/signin">Signin Here!</Link>
      </h5>

      {/* <p className="text-dark text-center">{JSON.stringify(values)}</p> */}
    </Base>
  );
};

export default Signup;
