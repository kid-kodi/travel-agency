import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Link, Alert } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [alertMessage, setAlertMessage] = useState(""); // État pour gérer le message de l'alerte
  const [alertSeverity, setAlertSeverity] = useState("success"); // État pour gérer la gravité de l'alerte

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: !value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur de connexion");

      // Stocker le token et les infos utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirection après connexion réussie
      navigate("/");

      // Afficher un message de succès
      setAlertMessage("Connexion réussie !");
      setAlertSeverity("success");
    } catch (error) {
      // Afficher un message d'erreur
      setAlertMessage(error.message || "Une erreur est survenue");
      setAlertSeverity("error");
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "300px",
          backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "-100px",
          padding: "2rem",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: "2rem",
            width: "100%",
            maxWidth: "400px",
            backdropFilter: "blur(30px)",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
            Connexion
          </Typography>

          {/* Affichage conditionnel de l'alerte */}
          {alertMessage && (
            <Alert variant="filled" severity={alertSeverity} sx={{ marginBottom: 2 }}>
            {alertMessage}
          </Alert>
          
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="dense"
              required
              error={errors.email}
              helperText={errors.email ? "Email requis" : ""}
            />

            <TextField
              fullWidth
              size="small"
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="dense"
              required
              error={errors.password}
              helperText={errors.password ? "Mot de passe requis" : ""}
            />
             
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                textTransform: "none",
                fontSize: "0.9rem",
                padding: "0.5rem",
              }}
            >
              Se connecter
            </Button>

            <Typography textAlign="center" mt={2} fontSize="0.9rem">
              Vous n'avez pas de compte ?{" "}
              <Link href="/register" color="primary" sx={{ fontWeight: "bold", textDecoration: "none" }}>
                S'inscrire
              </Link>
            </Typography>
            <Typography textAlign="center" mt={2} fontSize="0.8rem">
              <Link href="/forgot-password"  sx={{ fontWeight: "bold", textDecoration: "none", color: "red" }}>
              Mot de passe oublié ?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
