import React, { useContext } from "react";
import { Formik } from "formik";
import { Button, Select, MenuItem } from "@mui/material";
import MultiStepFromContext from "./MultiStepFromContext";

const StepThree = () => {
  const { details, setDetails, prev, next } = useContext(MultiStepFromContext);

  // Liste des sièges disponibles, ajout de "-" comme valeur par défaut
  const seats = ["-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  return (
    <Formik
      initialValues={details}  // Utilise les valeurs provenant de `details`
      enableReinitialize        // Assure que Formik se réinitialise avec les nouvelles valeurs à chaque fois
      onSubmit={(values) => {
        setDetails(values);  // Met à jour les valeurs de `details` dans le contexte
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.seatNumber || values.seatNumber === "-") {
          errors.seatNumber = "Veuillez sélectionner un numéro de siège";
        }
        return errors;
      }}
    >
      {({ handleSubmit, errors, values, handleChange, setFieldValue }) => (
        <div className="details__wrapper">
          {/* Sélection du numéro de siège */}
          <div className={`form__item ${errors.seatNumber && "input__error"}`} style={{ flex: 1 }}>
            <label>Numéro de siège *</label>
            <Select
              name="seatNumber"
              value={values.seatNumber || "-"}
              onChange={handleChange}  // Utiliser handleChange pour synchroniser les données
              style={{ width: "150px", height: "35px" }}  // Réduire la largeur du Select
            >
              {seats.map((seat) => (
                <MenuItem key={seat} value={seat}>
                  {seat}
                </MenuItem>
              ))}
            </Select>
            <p className="error__feedback">{errors.seatNumber}</p>
          </div>

          {/* Boutons Précédent et Suivant */}
          <div className="form__item button__items d-flex justify-content-between">
            <Button type="default" onClick={prev}>
              Back
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default StepThree;
