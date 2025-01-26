import * as React from 'react';
import { Button, Col, Row } from "antd";
import { useContext, useState } from "react";
import MultiStepFromContext from "./MultiStepFromContext";
import TicketGenerator from "./TicketGenerator";
import { useNavigate } from "react-router-dom";
import { Alert, Stack } from '@mui/material'; // Importer les composants MUI

const Review = ({ successMessage, setSuccessMessage }) => {
  const { details, address, prev } = useContext(MultiStepFromContext);
  const [showTicket, setShowTicket] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/reservation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          departureCity: address.departureCity,
          arrivalCity: address.arrivalCity,
          date: address.date,
          tarif: address.tarif,
          horaire: details.horaire,
          seatNumber: details.seatNumber,
          user: localStorage.getItem("userId"),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message || "Réservation créée avec succès !");
        setTimeout(() => {
          window.location.reload(); // Redirection après succès
        }, 2000);
      } else {
        throw new Error(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage(""); // Réinitialiser le message de succès en cas d'erreur
    } finally {
      setLoading(false);
    }
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
              Confirmer et Générer
            </Button>
            <Button type="primary" onClick={() => navigate("/Paiement")}>
              Méthode de Paiement
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Review;
