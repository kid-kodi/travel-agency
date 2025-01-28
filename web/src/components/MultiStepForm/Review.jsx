import * as React from 'react';
import { Button, Col, Row } from "antd";
import { useContext, useState } from "react";
import MultiStepFromContext from "./MultiStepFromContext";
import TicketGenerator from "./TicketGenerator";
import { useNavigate } from "react-router-dom";
import { Alert, Stack } from '@mui/material'; // Importer les composants MUI
import MethodePaiement from "../MethodePaiement";

const Review = ({ successMessage, setSuccessMessage }) => {
  const { details, address, prev } = useContext(MultiStepFromContext);
  console.log("Valeur de address :", address);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const handleSubmit = async () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");


     // Stocker toutes les informations nécessaires
     const reservationData = {
      token, // Stocker le token
      details, // Stocker les détails de la réservation (horaire, numéro de siège, etc.)
      address, // Stocker l'adresse du trajet (ville de départ, d'arrivée, tarif, etc.)
      formattedDate, // Ajouter la date formatée
    };

    // Sauvegarde dans localStorage
    localStorage.setItem("reservationData", JSON.stringify(reservationData));
    setLoading(false);
    setShowPaymentMethods(true);

  };

  const formattedDate = new Date(address.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  

  if (showTicket) {
    return <TicketGenerator />;
  }

  if (showPaymentMethods) {
    return <MethodePaiement onSelectMethod={(index) => {
      if (index === 3) { // Stripe correspond à l'index 3
        navigate("/Stripe");
      }
    }} />;
  }
  
  return (
    <div className={"details__wrapper"}>
      <style jsx>{`
        .custom-heading {
          font-size: 1.5rem;
          text-decoration: underline;
        }
      `}</style>

      <Row>
         {/* Afficher l'alerte de succès */}
          {/* {successMessage && (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="success">{successMessage}</Alert>
            </Stack>
          )} */}

        <Col span={24}>
          <h1 className="custom-heading">Résumé de votre trajet (RafRaf)</h1>
          <p><strong>Trajet :</strong> De {address.departureCity} - {address.arrivalCity}</p>
          <p><strong>Tarif :</strong> {address.tarif} FCFA</p>
          <p><strong>Horaire :</strong> {details.horaire}</p>
          <p><strong>Numéro de siège :</strong> {details.seatNumber}</p>
          <p><strong>Date de départ :</strong> Pour le {formattedDate}</p>
        </Col>

        <Col span={24}>
          <div className="form__item button__items d-flex justify-content-between">
            <Button type="default" onClick={prev}>
              Retour
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Confirmer et Payer
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Review;
