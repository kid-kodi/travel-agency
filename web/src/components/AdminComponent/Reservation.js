import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import pour la redirection
import { Box, Typography } from '@mui/material';
import { ReservationSmartTable } from './ReservationSmartTable';
import DatePicker from "react-datepicker";
import { CListGroup, CListGroupItem } from '@coreui/react';
import { CDatePicker } from '@coreui/react-pro'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import { 
  CButton, 
  CModal, 
  CModalBody, 
  CModalFooter, 
  CFormSelect, 
  CModalHeader, 
  CModalTitle, 
  CForm, 
  CFormInput 
} from "@coreui/react";
import { CCol, CRow } from '@coreui/react';
import StyleIcon from '@mui/icons-material/Style';
import TicketProcess from 'components/TicketProcess';

const Reservation = () => {
  const navigate = useNavigate(); 
  const [visible, setVisible] = useState(false);
  const [trajets, setTrajets] = useState([]);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [seatNumbers, setSeatNumbers] = useState([]);


  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  console.log("Token récupéré :", token);

  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    date: '',
    tarif: '',
    horaire: '',
    seatNumber: '',
    paymentStatus: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
  
      if (name === "departureCity") {
        // Filtrer les villes d'arrivée basées sur la ville de départ sélectionnée
        const filteredArrivalCities = [...new Set(
          trajets.filter((trajet) => trajet.origine === value).map((trajet) => trajet.destination)
        )];
  
        setArrivalCities(filteredArrivalCities);
        newData.arrivalCity = ""; // Réinitialiser la ville d'arrivée
        setSelectedTrajet(null);  // Réinitialiser le trajet sélectionné
      }
  
      if (name === "arrivalCity") {
        const trajet = trajets.find(
          (trajet) => trajet.origine === newData.departureCity && trajet.destination === value
        );
  
        if (trajet) {
          setSelectedTrajet(trajet);
          newData.tarif = trajet.prix;
          newData.horaire = `${trajet.horaire_depart} - ${trajet.horaire_arrivee}`;
  
          // Mettre à jour les numéros de sièges
          const capacite = trajet.vehicule_id?.capacite || 0;
          setSeatNumbers(Array.from({ length: capacite }, (_, i) => i + 1));
        }
      }
  
      return newData;
    });
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedTrajet || !formData.date || !formData.seatNumber) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    const reservationData = {
      departureCity: selectedTrajet.origine,
      arrivalCity: selectedTrajet.destination,
      date: formData.date,
      tarif: selectedTrajet.prix,
      horaire: `${selectedTrajet.horaire_depart} - ${selectedTrajet.horaire_arrivee}`,
      seatNumber: formData.seatNumber,
      user: localStorage.getItem("userId"),
      paymentStatus: "incomplet", // Définition par défaut
    };

    console.log("Données de réservation :", reservationData);
  
    try {
      const response = await axios.post("http://localhost:5001/api/reservation/create", reservationData, {
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assurez-vous d'envoyer le token d'authentification
        },
      });
  
      if (response.data.success) {
        alert("Réservation effectuée avec succès !");
        setVisible(false); // Fermer la modal après succès
        // Sauvegarder la réservation dans le localStorage
         // Stocker l'ID de la réservation dans le localStorage
        console.log("ID de la réservation stocké :", response.data.reservation._id);
        localStorage.setItem("reservationId", response.data.reservation._id);
        // Rediriger vers la page de paiement
        navigate("/Paiement");
      } else {
        alert("Échec de la réservation, veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };


  useEffect(() => {
    // Récupérer la liste des trajets depuis l'API
    console.log("User ID stocké:", localStorage.getItem("user._id"));

    axios
      .get("http://localhost:5001/api/trajet/all-no-pagination") // Mets l'URL correcte de ton API
      .then((response) => {
        if (response.data.success) {
          setTrajets(response.data.trajets);

          // Extraire les villes de départ uniques
          const uniqueDepartureCities = [
            ...new Set(response.data.trajets.map((trajet) => trajet.origine)),
          ];
          setDepartureCities(uniqueDepartureCities);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des trajets :", error);
      });
  }, []);



// Vérifie si un trajet est sélectionné
const trajetSelectionne = trajets.length > 0 ? trajets[0] : null; 

  return (
    <Box p={3}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Réservations
        </Typography>
        <CButton color="primary" onClick={() => setVisible(true)}>
          Nouvelle Réservation <StyleIcon />
        </CButton>
      </div>

      <Typography>Gérez vos réservations ici.</Typography>
      <ReservationSmartTable />

      <CModal  alignment="center" visible={visible} onClose={() => setVisible(false)} >
        <CModalHeader closeButton className="w-100 justify-content-center">
          <CModalTitle  style={{ fontSize: "1rem", fontWeight: "bold", color: "rgb(31, 140, 58)", textAlign: "center", width: "100%" }}>
            Cher Admin, veuillez effectuer votre réservation ici <StyleIcon />
          </CModalTitle>
        </CModalHeader>

        <CModalBody style={{ marginBottom: '150px' }}>
        {/* formulaire de reservation */}
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            <CCol md={6}>
              <label htmlFor="departureCity">Départ</label>
              <CFormSelect id="departureCity" name="departureCity" value={formData.departureCity} onChange={handleChange} required>
                <option value="">Sélectionnez une ville</option>
                {departureCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <label htmlFor="arrivalCity">Destination</label>
              <CFormSelect id="arrivalCity" name="arrivalCity" value={formData.arrivalCity} onChange={handleChange} required>
                <option value="">Sélectionnez une ville</option>
                {arrivalCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            

            <CCol md={6}>
              <label htmlFor="date">Date</label>
              <CFormInput id="date" type="date" name="date" value={formData.date} onChange={handleChange} required />
            </CCol>




            <CCol md={6}>
              <label htmlFor="seatNumber">Numéro de siège</label>
              <CFormSelect id="seatNumber" name="seatNumber" value={formData.seatNumber} onChange={handleChange} required>
                <option value="">siège</option>
                {seatNumbers.map((seat, index) => (
                  <option key={index} value={seat}>{seat}</option>
                ))}
              </CFormSelect>
            </CCol>

            {selectedTrajet && (
              <CListGroup>
                <CListGroupItem className="mb-2">
                  <strong>Date <CalendarMonthIcon/>:{"  "} </strong> {formData.date || "Sélectionnez une date"}
                </CListGroupItem>
                <CListGroupItem className="mb-2">
                  <strong>Tarif <PaidIcon/> : </strong> {selectedTrajet.prix} FCFA
                </CListGroupItem>
                <CListGroupItem className="mb-2">
                  <strong>Distance <AddRoadIcon/> : </strong> {selectedTrajet.distance} Km/h
                </CListGroupItem>
                <CListGroupItem className="mb-2">
                  <strong>Horaire <AccessTimeIcon/>:    </strong> {selectedTrajet.horaire_depart} <ArrowRightAltIcon/> {selectedTrajet.horaire_arrivee}
                </CListGroupItem>
              </CListGroup>
            )}
          </CRow>
        </CForm>

      </CModalBody>


        
        <CModalFooter>
         <CButton color="secondary" onClick={() => setVisible(false)}>Fermer</CButton>
         <CButton color="primary" type="submit" onClick={handleSubmit}>Valider la reservation</CButton>
          {/* <CButton color="primary">Confirmer</CButton> */}
        </CModalFooter>
      </CModal>

    </Box>
  );
};

export default Reservation;


    {/* <TicketProcess /> */}



