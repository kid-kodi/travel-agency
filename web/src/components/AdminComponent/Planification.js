import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CAccordion, CContainer, CAccordionBody, CAccordionHeader, CAccordionItem, 
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle 
} from '@coreui/react';
import { Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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
  const [visible, setVisible] = useState(false);
  const [trajets, setTrajets] = useState([]);
  const [selectedTrajets, setSelectedTrajets] = useState([]);
  const [selectedJour, setSelectedJour] = useState('');
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // success ou error
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:5001/api/trajet/all-no-pagination")
      .then(response => {
        if (isMounted) setTrajets(response.data.trajets);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des trajets :", error);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 20000); // Efface le message après 20 secondes
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Réponse du serveur:", response.data);
      setMessage(response.data.message);
      setSeverity("success");
      setVisible(false);
      setSelectedTrajets([]);
    } catch (error) {
      console.error("Erreur lors de la création du planning:", error);
      setMessage(error.response?.data?.message || "Une erreur s'est produite");
      setSeverity("error");
    }
  };
  

  return (
    <CContainer>
      <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 'bold', mt: 3, mb: 2 }}>
        Planification départ
      </Typography>

      {/* Affichage du message avec timeout */}
      {message && <Alert severity={severity} sx={{ mb: 2 }}>{message}</Alert>}

      <CAccordion>
        {joursSemaine.map((jour, index) => (
          <CAccordionItem itemKey={index + 1} key={jour}>
            <CAccordionHeader>{jour}</CAccordionHeader>
            <CAccordionBody>
              <Box display="flex" justifyContent="center">
                <IconButton color="primary" onClick={() => { setVisible(true); setSelectedJour(jour); }}>
                  <AddIcon />
                </IconButton>
              </Box>
            </CAccordionBody>
          </CAccordionItem>
        ))}
      </CAccordion>

      {/* Modal */}
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
