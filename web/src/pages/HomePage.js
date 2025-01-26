import React from "react";
import { useAlert } from "../contexts/AlertContext"; // Importer le hook de contexte
import { Alert, Stack } from "@mui/material"; // Utiliser MUI pour afficher l'alerte
import TicketProcess from "../components/TicketProcess";
import Accueil from "../components/Accueil";

export default function HomePage() {
  const { alert } = useAlert();
  return (
    <>
    <section className="container">
      {alert.open && (
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          spacing={2}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Stack>
      )}
      
    </section>
      <Accueil/>
     <TicketProcess/>
    </>
  );
}
