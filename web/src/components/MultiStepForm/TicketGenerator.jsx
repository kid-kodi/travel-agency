import React, { useContext, useRef, useState, useEffect } from "react";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import MultiStepFromContext from "./MultiStepFromContext";
import JsBarcode from "jsbarcode"; // Importer jsBarcode

const TicketGenerator = () => {
  const { details, address, prev } = useContext(MultiStepFromContext);
  const ticketRef = useRef(null);
  const barcodeRef = useRef(null); // Référence pour le code-barres
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [reservationDate, setReservationDate] = useState(null); // Stocker la date de réservation

  const formattedDate = new Date(address.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (ticketGenerated && barcodeRef.current) {
      JsBarcode(barcodeRef.current, details.seatNumber, {
        format: "CODE128",
        displayValue: true,
        fontSize: 14,
        width: 3, // Augmente la largeur des barres
        height: 50, // Réduit la hauteur du code-barres
        margin: 10,
      });
    }
  }, [ticketGenerated, details.seatNumber]);

  const generateTicket = () => {
    setTicketGenerated(true);
    setReservationDate(new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  };

  const downloadPDF = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 10;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        pdf.save("ticket_reservation.pdf");
      });
    }
  };

  return (
    <div className="details__wrapper">
      <style jsx>{`
        .ticket-container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          margin: 20px auto;
          text-align: center;
          width: 60%;
          position: relative;
        }
        .custom-heading {
          font-size: 1.5rem;
          text-decoration: underline;
          text-align: center;
          margin-bottom: 15px;
        }
        .ticket-details {
          text-align: left;
          margin-left: 10px;
          font-size: 0.9rem; 
          line-height: 1.5;
        }
        .success-message {
          font-size: 1.2rem;
          font-weight: bold;
          color: green;
          margin-top: 10px;
        }
        .button-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .barcode-container {
          margin-top: 20px;
          text-align: center;
        }
        .separator {
          width: 100%;
          height: 4px;
          background: black;
          margin-top: 10px;
        }
      `}</style>

      {!ticketGenerated ? (
        <div className="ticket-container">
          <h1 className="custom-heading">Résumé de votre trajet</h1>
          <div className="ticket-details">
            <p><strong>Trajet :</strong> {address.departureCity} → {address.arrivalCity}</p>
            <p><strong>Horaire :</strong> {details.horaire}</p>
            <p><strong>Numéro de siège :</strong> {details.seatNumber}</p>
            <p><strong>Date de départ :</strong> {formattedDate}</p>
          </div>

          <div className="button-container">
            <Button type="default" onClick={prev}>Retour</Button>
            <Button type="primary" onClick={generateTicket}>Confirmer et Générer le Ticket</Button>
          </div>
        </div>
      ) : (
        <div className="mb">
          <div ref={ticketRef} className="ticket-container">
            <h1 className="custom-heading">Ticket de Réservation <i className="fas fa-bus"></i></h1>
            <p className="success-message">✅ Bon voyage, à bientôt ! 🚀</p>
            <div className="ticket-details">
              <p><strong>Trajet :</strong> {address.departureCity} → {address.arrivalCity}</p>
              <p><strong>Horaire :</strong> {details.horaire}</p>
              <p><strong>Numéro de siège :</strong> {details.seatNumber}</p>
              <p><strong>Date de départ :</strong> {formattedDate}</p>
              <p><strong>Date de réservation :</strong> {reservationDate}</p> {/* Ajouté ici */}
            </div>

            {/* Section du code-barres */}
            <div className="barcode-container">
              <svg ref={barcodeRef}></svg>
              <div className="separator"></div> {/* Barre noire sous le code-barres */}
            </div>
          </div>

          <div className="button-container">
            <Button type="primary" onClick={downloadPDF}>Télécharger le Ticket (PDF)</Button>
            <Button type="default" onClick={() => window.location.reload()}>Retour au Menu</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGenerator;
