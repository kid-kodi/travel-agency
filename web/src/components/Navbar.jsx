import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress"; // Import du CircularProgress

const Navbar = () => {
  const navigate = useNavigate();

  // Récupérer les données utilisateur et le token depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Supprimer les données utilisateur du localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Fermer le menu et rediriger vers la page de connexion
      handleCloseUserMenu();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <>
      {/* Navbar Start */}
      <div class="container-fluid topbar bg-secondary d-none d-xl-block w-100">
            <div class="container">
            <div className="row gx-0 align-items-center" style={{ height: "45px" }}>
                    <div class="col-lg-6 text-center text-lg-start mb-lg-0">
                        <div class="d-flex flex-wrap">
                            <a href="#" class="text-muted me-4"><i class="fas fa-map-marker-alt text-primary me-2"></i>Find A Location</a>
                            <a href="tel:+01234567890" class="text-muted me-4"><i class="fas fa-phone-alt text-primary me-2"></i>+225 0707076692</a>
                            <a href="mailto:example@gmail.com" class="text-muted me-0"><i class="fas fa-envelope text-primary me-2"></i>raf-e@gmail.com</a>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center text-lg-end">
                        <div class="d-flex align-items-center justify-content-end">
                            <a href="#" class="btn btn-light btn-sm-square rounded-circle me-3"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="btn btn-light btn-sm-square rounded-circle me-3"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="btn btn-light btn-sm-square rounded-circle me-3"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="btn btn-light btn-sm-square rounded-circle me-0"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <div className="container-fluid nav-bar sticky-top px-0 px-lg-4 py-2 py-lg-0">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
          <a href="/" className="navbar-brand p-0 d-flex align-items-center">
            <img src="img/logoraf.jpg" alt="Raf-Raf Logo" className="me-2" style={{ height: "50px" }} />
          </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav mx-auto py-0">
                <Link to="/" className="nav-item nav-link">ACHAT TICKETS</Link>
                <Link to="/" className="nav-item nav-link">NOS PROGRAMMES</Link>
                <Link to="/" className="nav-item nav-link">NOS SERVICES</Link>
                <Link to="/" className="nav-item nav-link">ACTUALITÉS</Link>
                <Link to="/contact" className="nav-item nav-link">CONTACTS</Link>
              </div>

              {token ? (
                // Avatar + Nom utilisateur si connecté
                <div className="navbar-nav d-flex align-items-center">
                  <Stack direction="row" spacing={0} alignItems="center">
                    <span className="nav-item nav-link">{user?.firstName}</span>
                    <Avatar
                      sx={{ cursor: "pointer" }}
                      alt={user?.name}
                      src={user?.avatar || "/broken-image.jpg"}
                      onClick={handleClick}
                    />
                  </Stack>
                </div>
              ) : (
                // Bouton Connexion si non connecté
                <Link to="/login" className="btn btn-primary rounded-pill py-2 px-4 me-2">
                  Se connecter
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* Navbar End */}

      {/* Menu déroulant */}
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <Link to="/user-profile">
            <Typography sx={{ textAlign: "center" }}>Profile</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography sx={{ textAlign: "center", color: "red" }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};




export default Navbar;
