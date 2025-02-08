import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReservationSmartTable } from './ReservationSmartTable';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '@coreui/coreui/dist/css/coreui.min.css'

const Reservation = () => {
  return (
    <Box p={3}>
      <Typography variant="h4">Réservations</Typography>
      <Typography>Gérez vos réservations ici.</Typography>
      <ReservationSmartTable />
    </Box>
  );
};

export default Reservation;
