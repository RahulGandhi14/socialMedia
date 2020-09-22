import React, { Fragment, useState } from "react";
import { isAuthenticated } from "../../authHelper";
import { createPost } from "./userapicalls";

const PostContent = ({ setReload = (f) => f, reload = undefined }) => {
  const [values, setValues] = useState({
    photo: "",
    caption: "",
    formData: new FormData(),
    error: "",
    success: false,
  });

  const [disable, setDisable] = useState(true);

  const { user, token } = isAuthenticated();

  const { caption, formData, error, success } = values;

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    if (name === "photo") {
      setDisable(!disable);
    }
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "" });
    createPost(user._id, token, formData)
      .then((data) => {
        if (data?.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            photo: "",
            caption: "",
            success: true,
          });
          setReload(!reload);
        }
      })
      .catch((err) => console.log(err));
  };

  const errorMessage = () => {
    return error && <h5 className="alert alert-danger text-center">{error}</h5>;
  };

  return (
    <Fragment>
      {errorMessage()}
      <div className="card">
        <p className="card-header">Write or Post something here...</p>
        <div className="card-body">
          <form>
            <div className="input-group">
              <div className="custom-file">
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  name="photo"
                  accept="image"
                  placeholder="choose a file"
                  className="custom-file-input"
                />
                <label className="custom-file-label">Choose file</label>
              </div>
            </div>
            <div className="input-group">
              <textarea
                onChange={handleChange("caption")}
                value={caption}
                placeholder="Caption"
                required
                className="form-control"
              ></textarea>
            </div>
            <button
              disabled={disable}
              onClick={onSubmit}
              className="btn btn-primary btn-block"
            >
              POST
            </button>
          </form>
          {/* <p className="text-dark text-center">{JSON.stringify(values)}</p> */}
        </div>
      </div>
    </Fragment>
  );
};

export default PostContent;
