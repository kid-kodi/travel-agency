import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icône de flèche

const paymentMethods = [
  {
    id: 1,
    description: "Payez par OM.",
    image: "img/orange.jpg",
  },
  {
    id: 2,
    description: "Payer par wave",
    image: "img/wave.webp",
  },
  {
    id: 3,
    description: "Payez par Moov.",
    image: "img/moov.png",
  },
  {
    id: 4,
    description: "Payez par Stripe",
    image: "img/stripe.gif",
  },
];

function MethodePaiement() {
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", padding: 2, textAlign: "center", position: "relative" }}>
      
      {/* 🔹 Titre */}
      <Typography
        variant="h6"
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          marginBottom: 2,
        }}
      >
        Sélectionnez votre méthode de paiement
      </Typography>

      {/* 💳 Liste des moyens de paiement */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "nowrap",
          overflowX: "auto",
          paddingX: 1,
        }}
      >
        {paymentMethods.map((method, index) => (
          <Card
            key={method.id}
            sx={{
              width: 150,
              height: 100,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginBottom: "12%",
            }}
          >
            <CardActionArea
              onClick={() => setSelectedMethod(index)}
              data-active={selectedMethod === index ? "" : undefined}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": { backgroundColor: "action.selectedHover" },
                },
              }}
            >
              {/* 📷 Image bien ajustée */}
              <CardMedia
                component="img"
                image={method.image}
                alt={method.title}
                sx={{
                  height: 50,
                  objectFit: "contain",
                  margin: "auto",
                }}
              />

              <CardContent sx={{ textAlign: "center", flexGrow: 1, padding: "8px" }}>
                <Typography variant="caption" color="text.secondary">
                  {method.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* 🔙 Flèche pour revenir à l'accueil */}
      <Button
         variant="contained"
            startIcon={<ArrowBackIcon />} // Icône de flèche
            onClick={() => navigate("/")}
            sx={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.8rem", // Réduction de la taille de la police
                padding: "3px 8px", // Réduction de l'espace autour du texte
                backgroundColor: "orange", // Couleur du bouton
                "&:hover": {
                backgroundColor: "#ff9800", // Légère variation de couleur au survol
                },
         }}
         >
        Retour
    </Button>
    </Card>
  );
}

export default MethodePaiement;
