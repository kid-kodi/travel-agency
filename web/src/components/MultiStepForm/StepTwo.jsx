import React, { useContext } from "react";
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import MultiStepFromContext from "./MultiStepFromContext";
import { Typography } from "@mui/material";

const StepTwo = () => {
  const { address, details, setDetails, next, prev } = useContext(MultiStepFromContext);

  const horaires = ["08:00-11:00", "12:00-16:00"];

  return (
    <Formik
      initialValues={details}
      enableReinitialize
      onSubmit={(values) => {
        setDetails(values);
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.horaire) errors.horaire = "Veuillez sélectionner un horaire";
        return errors;
      }}
    >
      {({ handleSubmit, errors, values, setFieldValue }) => (
        <div className="details__wrapper">

        <Typography variant="body1" fontSize="0.9rem" fontWeight="bold">
          Le tarif {address.departureCity} → {address.arrivalCity} sera de :  
          <Typography component="span" color="primary" fontWeight="bold">
            {address.tarif} FCFA
          </Typography>
        </Typography>


          <div className={`form__item ${errors.horaire && "input__error"}`}>
            <FormControl>
              <FormLabel>Choisissez un horaire *</FormLabel>
              <RadioGroup
                name="horaire"
                value={values.horaire}
                onChange={(e) => setFieldValue("horaire", e.target.value)}
              >
                {horaires.map((horaire) => (
                  <FormControlLabel key={horaire} value={horaire} control={<Radio />} label={horaire} />
                ))}
              </RadioGroup>
            </FormControl>
            <p className="error__feedback">{errors.horaire}</p>
          </div>

          <div className="form__item d-flex justify-content-between">
            <Button type="default" onClick={prev}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default StepTwo;
