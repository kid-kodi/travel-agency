import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ReservationSmartTable } from './ReservationSmartTable';
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
import StyleIcon from '@mui/icons-material/Style';
import TicketProcess from 'components/TicketProcess';

const Reservation = () => {
  const [visible, setVisible] = useState(false);

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

      <CModal size="lg" alignment="center" visible={visible} onClose={() => setVisible(false)} >
        <CModalHeader closeButton className="w-100 justify-content-center">
          <CModalTitle style={{ fontSize: "1rem", fontWeight: "bold", color: "rgb(31, 140, 58)", textAlign: "center", width: "100%" }}>
            Cher Admin, veuillez effectuer votre réservation ici <StyleIcon />
          </CModalTitle>
        </CModalHeader>

        <CModalBody style={{ marginBottom: '150px' }}>
          <TicketProcess />
        </CModalBody>
        
        <CModalFooter>
      
          {/* <CButton color="primary">Confirmer</CButton> */}
        </CModalFooter>
      </CModal>

    </Box>
  );
};

export default Reservation;
