import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // <-- put your logo image here

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg shadow"
      style={{
        background: "linear-gradient(90deg, #0B2E26, #145C43)",
        padding: "10px 20px",
      }}
    >
      <div className="container-fluid">

        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="La Cielo Garden"
            style={{ height: "60px", marginRight: "10px" }}
          />
          <span
            style={{
              color: "#C8A96A",
              fontWeight: "bold",
              fontSize: "18px",
              letterSpacing: "1px",
            }}
          >
            
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          style={{ borderColor: "#C8A96A" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto">

            {[
              { name: "Home", path: "/" },
              { name: "Bar", path: "/Bar" },
              { name: "Kitchen", path: "/Kitchen" },
              { name: "Guest House", path: "/GuestHouse" },
              { name: "Gym", path: "/GYM" },
              { name: "Billiard", path: "/Billiard" },
              { name: "Expenses", path: "/Expenses" },
              { name: "Staff", path: "/Credits" },
            ].map((item, index) => (
              <li className="nav-item mx-2" key={index}>
                <Link
                  className="nav-link"
                  to={item.path}
                  style={{
                    color: "white",
                    fontWeight: "500",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "#C8A96A")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = "white")
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;