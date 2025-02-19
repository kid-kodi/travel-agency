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
     const reservationDatas = {
      token, // Stocker le token
      details, // Stocker les détails de la réservation (horaire, numéro de siège, etc.)
      address, // Stocker l'adresse du trajet (ville de départ, d'arrivée, tarif, etc.)
      formattedDate, // Ajouter la date formatée
    };

    const reservationData = {
      departureCity: address.departureCity,
      arrivalCity: address.arrivalCity,
      date: address.date,
      tarif: address.tarif,
      horaire: details.horaire,
      seatNumber: details.seatNumber,
      user: localStorage.getItem("userId"),
      paymentStatus: "incomplete", // Création avec le statut "incomplete"
    };
    try {
    const response = await fetch("http://localhost:5001/api/reservation/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Réservation créée avec succès :", data);

      // Stocker l'ID de la réservation et les détails dans localStorage
      localStorage.setItem("reservationData", JSON.stringify({ ...reservationData, id: data.id }));
      localStorage.setItem("reservationId", data.reservation._id);
      // Afficher les méthodes de paiement
      setShowPaymentMethods(true);
    } else {
      throw new Error(data.message || "Une erreur est survenue lors de la création de la réservation.");
    }
  } catch (error) {
    console.error("Erreur lors de la création de la réservation :", error);
  }


    // Sauvegarde dans localStorage
    localStorage.setItem("reservationDatas", JSON.stringify(reservationDatas));
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
