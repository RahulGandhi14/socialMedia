import React from "react";
import NavBar from "./NavBar";

const Base = ({ children, className = "text-dark p-4" }) => {
  return (
    <div className="page-container">
      <NavBar />
      <div className="container-fluid content-wrap">
        <div className={className}>{children}</div>
      </div>
      <footer className="footer bg-light mt-auto">
        <div className="container-fluid bg-primary text-white text-center py-1">
          <h4>If you have any questions, feel free to reach out!</h4>
          <button className="btn btn-light btn-lg rounded">
            <a
              style={{ textDecoration: "none", color: "black" }}
              href="https://www.linkedin.com/in/rahulgandhi14/"
              target="_blank"
            >
              Contact Me
            </a>
          </button>
        </div>
        <div className="container text-center">
          {/* <span className="text-m textColor">
          An Amazing <span className="text-white">MERN</span> Bootcamp
        </span> */}
        </div>
      </footer>
    </div>
  );
};

export default Base;
