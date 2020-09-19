import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../authHelper";
import Base from "../../core/Base";
import { getUser, updateUser } from "./userapicalls";

const UpdateUser = () => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    photo: "",
    city: "",
    error: "",
    success: false,
    formData: new FormData(),
  });

  const { firstname, lastname, city, error, success, formData } = values;

  const preload = (userId) => {
    getUser(userId).then((data) => {
      if (data?.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          firstname: data.firstname,
          lastname: data.lastname,
          city: data.city,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    preload(user._id);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
    // console.log(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "" });
    updateUser(user._id, formData, token)
      .then((data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            firstname: "",
            lastname: "",
            city: "",
            error: "",
            success: true,
          });
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
            <h5>Your account details has been updated!</h5>
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
            <h5>Failed to update: {error}</h5>
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
      <p className="text-center mt-2">
        <h5>
          Already have an account? <Link to="/signin">Signin Here!</Link>
        </h5>
      </p>

      {/* <p className="text-dark text-center">{JSON.stringify(values)}</p> */}
    </Base>
  );
};

export default UpdateUser;
