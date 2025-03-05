import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import pour la redirection
import { Box, Typography } from '@mui/material';
import { ReservationSmartTable } from './ReservationSmartTable';
import { CListGroup, CListGroupItem } from '@coreui/react';
import { CDatePicker } from '@coreui/react-pro'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import AirlineSeatLegroomReducedIcon from '@mui/icons-material/AirlineSeatLegroomReduced';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import du style de react-datepicker
import { io } from "socket.io-client";
import { CButton, CModal,CModalBody, CModalFooter, CFormSelect, CModalHeader, CModalTitle, CForm, CFormInput } from "@coreui/react";
import { CCol, CRow } from '@coreui/react';
import StyleIcon from '@mui/icons-material/Style';
import TicketProcess from 'components/TicketProcess';
import { useLocation } from 'react-router-dom';
const socket = io("http://localhost:5001");

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [visible, setVisible] = useState(false);
  const [trajets, setTrajets] = useState([]);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  console.log("Token récupéré :", token);

  const [formData, setFormData] = useState({
    departureCity: location.state?.departureCity || '',
    arrivalCity: location.state?.arrivalCity || '',
    date: location.state?.date || '',
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
        
          // Calcul de la capacité totale
          const capacite = trajet.vehicule_id?.capacite || 0;
        
           // Générer tous les sièges possibles
          const allSeats = Array.from({ length: capacite }, (_, i) => i + 1);

          // Filtrer les sièges disponibles
          const availableSeats = allSeats.filter(seat => !reservedSeats.includes(seat.toString()));

          setSeatNumbers(availableSeats);
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
        // alert("Réservation effectuée avec succès !");
        setSuccessMessage(response.data.message);
      
         // Stocker l'ID de la réservation dans le localStorage
        console.log("ID de la réservation stocké :", response.data.reservation._id);
        localStorage.setItem("reservationId", response.data.reservation._id);
        localStorage.setItem("reservationData", JSON.stringify(reservationData));
        // Rediriger vers la page de paiement
        setTimeout(() => {
          setVisible(false); // Fermer la modal après succès
          navigate("/Paiement"); // Redirige après 30 secondes
        }, 1000);
        
      } else {
        alert("Échec de la réservation, veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue. Veuillez réessayer ou revoire le numero de siege.");
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

  useEffect(() => {
    if (selectedTrajet && formData.date) {
      axios
        .get(`http://localhost:5001/api/reservation/seatReservation?departureCity=${selectedTrajet.origine}&arrivalCity=${selectedTrajet.destination}&date=${formData.date}`)
        .then(response => {
          if (response.data.success) {
            const reservedSeatsList = response.data.reservations.map(seat => seat.toString()); // S'assurer que ce sont des strings
            setReservedSeats(reservedSeatsList);
  
            // Mise à jour des sièges disponibles après récupération des réservations
            const capacite = selectedTrajet.vehicule_id?.capacite || 0;
            const allSeats = Array.from({ length: capacite }, (_, i) => i + 1);
            const availableSeats = allSeats.filter(seat => !reservedSeatsList.includes(seat.toString()));
            setSeatNumbers(availableSeats);
          }
        })
        .catch(error => console.error("Erreur lors de la récupération des sièges réservés :", error));
    }
  }, [selectedTrajet, formData.date]);
  
  // Mettre à jour le formulaire si les données sont passées via la navigation
  useEffect(() => {
    if (location.state) {
      const { departureCity, arrivalCity } = location.state;
  
      // Mettre à jour le formulaire avec les valeurs passées
      setFormData((prevData) => ({
        ...prevData,
        departureCity,
        arrivalCity
      }));
  
      // Filtrer les villes d'arrivée basées sur la ville de départ sélectionnée
      const filteredArrivalCities = [...new Set(
        trajets.filter((trajet) => trajet.origine === departureCity).map((trajet) => trajet.destination)
      )];
  
      setArrivalCities(filteredArrivalCities);
      
      // Trouver le trajet correspondant
      const trajetCorrespondant = trajets.find(
        (trajet) => trajet.origine === departureCity && trajet.destination === arrivalCity
      );
  
      if (trajetCorrespondant) {
        setSelectedTrajet(trajetCorrespondant);
  
        setFormData((prevData) => ({
          ...prevData,
          tarif: trajetCorrespondant.prix,
          horaire: `${trajetCorrespondant.horaire_depart} - ${trajetCorrespondant.horaire_arrivee}`
        }));
  
        // Récupérer les sièges réservés pour ce trajet
        axios
          .get(`http://localhost:5001/api/reservation/seatReservation?departureCity=${departureCity}&arrivalCity=${arrivalCity}&date=${new Date().toISOString().split("T")[0]}`)
          .then(response => {
            if (response.data.success) {
              const reservedSeatsList = response.data.reservations.map(seat => seat.toString());
              setReservedSeats(reservedSeatsList);
  
              // Générer la liste des sièges disponibles
              const capacite = trajetCorrespondant.vehicule_id?.capacite || 0;
              const allSeats = Array.from({ length: capacite }, (_, i) => i + 1);
              const availableSeats = allSeats.filter(seat => !reservedSeatsList.includes(seat.toString()));
  
              setSeatNumbers(availableSeats);
            }
          })
          .catch(error => console.error("Erreur lors de la récupération des sièges réservés :", error));
      }
      setVisible(true);
    }
  }, [location.state, trajets]);
  


// Vérifie si un trajet est sélectionné
const trajetSelectionne = trajets.length > 0 ? trajets[0] : null; 
console.log("donnee passe forma :", formData);
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
          <CRow className="">
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
            <DatePicker
              selected={formData.date ? new Date(formData.date) : null}
              onChange={(date) => setFormData({ ...formData, date: date.toISOString().split("T")[0] })}
              dateFormat="yyyy-MM-dd"
              className="form-control" // Assure la cohérence avec le style de CoreUI
              placeholderText="Sélectionnez une date"
            />
          </CCol>


            <CCol md={6}>
              <label htmlFor="seatNumber">Numéro de siège</label>
              <CFormSelect id="seatNumber" name="seatNumber" value={formData.seatNumber} onChange={handleChange} required>
                <option value="">Sélectionnez un siège</option>
                {seatNumbers.map((seat, index) => (
                  <option key={index} value={seat}>{seat}</option>
                ))}
              </CFormSelect>
            </CCol>

            {successMessage && (
              <div style={{
                backgroundColor: "#dff0d8",
                color: "#3c763d",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                textAlign: "center"
              }}>
                {successMessage}
              </div>
            )}

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
                  <strong>Nombre de places <AirlineSeatLegroomReducedIcon/> : </strong> {selectedTrajet.vehicule_id.capacite} 
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



