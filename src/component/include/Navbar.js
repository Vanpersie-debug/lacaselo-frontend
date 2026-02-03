import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container-fluid">

        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-speedometer2 me-2"></i>
          La CielO
        </Link>

        {/* Toggle button (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Bar">
                <i className="bi bi-cup-straw me-1"></i> Bar
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Kitchen">
                <i className="bi bi-egg-fried me-1"></i> Kitchen
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/GuestHouse">
                <i className="bi bi-building me-1"></i> Guest House
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/GYM">
                <i className="bi bi-activity me-1"></i> Gym
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Billiard">
                <i className="bi bi-circle me-1"></i> Billiard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Expenses">
                <i className="bi bi-cash-stack me-1"></i> Expenses
              </Link>
            </li>

            {/* Employee Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-people me-1"></i> Employee
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/Employee">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Employee List
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
