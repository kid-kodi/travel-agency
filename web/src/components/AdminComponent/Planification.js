import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CAccordion, CContainer, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';
import { io } from "socket.io-client";
import { Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function Planification() {
  const socket = io("http://localhost:5001");
  const [visible, setVisible] = useState(false);
  const [trajets, setTrajets] = useState([]);
  const [selectedTrajets, setSelectedTrajets] = useState([]);
  const [selectedJour, setSelectedJour] = useState('');
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [plannings, setPlannings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    
    socket.on("planning:update", (data) => {
      if (data.type === "create") {
        setPlannings(prevPlannings => [...prevPlannings, data.planning]);
      } else if (data.type === "fetch") {
        setPlannings(data.plannings);
      }
    });
  
    axios.get("http://localhost:5001/api/trajet/all-no-pagination")
      .then(response => {
        if (isMounted) setTrajets(response.data.trajets);
      })
      .catch(error => console.error("Erreur lors de la récupération des trajets :", error));
  
    axios.get("http://localhost:5001/api/planning/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setPlannings(response.data.plannings);
      })
      .catch(error => console.error("Erreur lors de la récupération des plannings :", error));
  
    return () => {
      isMounted = false;
      socket.off("planning:update");
    };
  }, []);
  

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 20000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedTrajets(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/planning/create", {
        jour: selectedJour,
        trajets: selectedTrajets,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(response.data.message);
      setSeverity("success");
      setVisible(false);
      setSelectedTrajets([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Une erreur s'est produite");
      setSeverity("error");
    }
  };

  const handleDeleteTrajet = async (planningId, trajetId) => {
    try {
      await axios.delete(`http://localhost:5001/api/planning/${planningId}/trajet/${trajetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setPlannings(plannings.map(planning => 
        planning._id === planningId ? { 
          ...planning, 
          trajets: planning.trajets.filter(t => t._id !== trajetId) 
        } : planning
      ));
  
      setMessage("Trajet supprimé avec succès");
      setSeverity("success");
    } catch (error) {
      setMessage("Erreur lors de la suppression du trajet");
      setSeverity("error");
    }
  };
  

  // Récupération du jour actuel en français
  const today = new Date();
  const options = { weekday: 'long' };
  const jourActuel = today.toLocaleDateString('fr-FR', options);

  // Filtrage des trajets du jour actuel
  const planningJourActuel = plannings.filter(planning => planning.jour.toLowerCase() === jourActuel.toLowerCase());
  const trajetsJourActuel = planningJourActuel.flatMap(planning => planning.trajets);


  return (
    <CContainer>
      <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 3, mb: 2 }}>
        Planification départ
      </Typography>
      {message && <Alert severity={severity} sx={{ mb: 2 }}>{message}</Alert>}
      <CAccordion>
        {joursSemaine.map((jour, index) => {
          const planningJour = plannings.filter(planning => planning.jour === jour);
          const trajetsJour = planningJour.flatMap(planning => planning.trajets);
          return (
            <CAccordionItem itemKey={index + 1} key={jour}>
              <CAccordionHeader>{jour}</CAccordionHeader>
              <CAccordionBody>
                {trajetsJour.length > 0 ? (
                 
                    <Box>
                      {trajetsJour.map((trajet, idx) => (
                        <Box key={trajet._id} display="flex" alignItems="center" justifyContent="space-between">
                        <Typography key={idx}>
                          {trajet.origine} → {trajet.destination} | Départ: {trajet.horaire_depart} - Arrivée: {trajet.horaire_arrivee}
                        </Typography>
                        <IconButton color="error" onClick={() => handleDeleteTrajet(planningJour[0]?._id, trajet._id)}>
                          <DeleteIcon />
                        </IconButton>
                        <Divider sx={{ my: 2 }} />
                        </Box>
                      ))}
                    </Box>
                    
                 
                ) : (
                  <Typography>Aucun trajet planifié pour ce jour.</Typography>
                )}
                <Box display="flex" justifyContent="center">
                  <IconButton color="primary" onClick={() => { setVisible(true); setSelectedJour(jour); }}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </CAccordionBody>
            </CAccordionItem>
          );
        })}
      </CAccordion>


      

      
        {/* Affichage des trajets du jour actuel */}
        {/* <CCard style={{ width: '18rem', marginTop: '1rem' }}>
            <CCardBody>
              <CCardTitle>Trajets du jour ({jourActuel})</CCardTitle>
              {trajetsJourActuel.length > 0 ? (
                trajetsJourActuel.map((trajet, idx) => (
                  <CCardText key={idx}>
                    <strong>{trajet.origine} → {trajet.destination}</strong> <br />
                    Départ: {trajet.horaire_depart} - Arrivée: {trajet.horaire_arrivee}
                  </CCardText>
                ))
              ) : (
                <CCardText>Aucun trajet prévu aujourd'hui.</CCardText>
              )}
            </CCardBody>
          </CCard> */}

      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Planifier un trajet - {selectedJour}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <FormControl fullWidth>
            <InputLabel id="select-trajet-label">Sélectionnez un ou plusieurs trajets</InputLabel>
            <Select
              labelId="select-trajet-label"
              id="select-trajet"
              multiple
              value={selectedTrajets}
              onChange={handleChange}
              input={<OutlinedInput label="Sélectionnez un ou plusieurs trajets" />}
              renderValue={(selected) => selected
                .map(id => trajets.find(t => t._id === id))
                .filter(trajet => trajet)
                .map(trajet => `${trajet.origine} → ${trajet.destination}`)
                .join(', ')}
              MenuProps={MenuProps}
            >
              {trajets.map(trajet => (
                <MenuItem key={trajet._id} value={trajet._id}>
                  <Checkbox checked={selectedTrajets.includes(trajet._id)} />
                  <ListItemText primary={`${trajet.origine} → ${trajet.destination} | Départ: ${trajet.horaire_depart} - Arrivée: ${trajet.horaire_arrivee}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Fermer
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Enregistrer
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
}

export default Planification;
