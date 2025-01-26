import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import MultiStepForm from './MultiStepForm';


function TicketProcess() {
  return (
    <>
      <div style={{ marginTop: '20px' }}>
        <h1 className="display-5 text-center ">Réservez ici</h1>
      </div>

    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // Centrer horizontalement
        alignItems: 'center',
        marginTop:'5%',
        marginLeft:'5%',
        '& > :not(style)': {
          m: 1,
          width: 580,
          height: 228,
        },
      }}
    >  
 
     <MultiStepForm/>
   
    </Box>
    </>
  );
}

export default TicketProcess;
