import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light border-bottom">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center lh-1 me-10 transition-opacity opacity-75-hover"
          to={`/`}
        >
          <img
            className="w-50 h-50"
            src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
            alt=""
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-between align-items-center"
          id="navbarSupportedContent"
        >
        </div>
      </div>
    </nav>
  );
}
