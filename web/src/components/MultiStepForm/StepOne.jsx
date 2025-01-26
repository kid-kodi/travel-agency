import React, { useContext } from "react";
import { Formik } from "formik";
import { Button, MenuItem, Select } from "@mui/material";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import MultiStepFromContext from "./MultiStepFromContext";
import { set } from "date-fns";

const cities = ["Abidjan", "Bouaké", "Korhogo", "Yamoussoukro"];
const tarifs = {
  "Abidjan-Bouaké": 15000,
  "Abidjan-Korhogo": 25000,
  "Abidjan-Yamoussoukro": 10000,
  "Bouaké-Abidjan": 15000,
  "Bouaké-Korhogo": 12000,
  "Bouaké-Yamoussoukro": 8000,
  "Korhogo-Abidjan": 25000,
  "Korhogo-Bouaké": 12000,
  "Korhogo-Yamoussoukro": 18000,
  "Yamoussoukro-Abidjan": 10000,
  "Yamoussoukro-Bouaké": 8000,
  "Yamoussoukro-Korhogo": 18000,
};


const StepOne = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFromContext);

  return (
    <Formik
      initialValues={address}
      onSubmit={(values) => {
        const trajet = `${values.departureCity}-${values.arrivalCity}`;
        const tarif = tarifs[trajet] || 0; // Si le trajet n'existe pas, tarif = 0
        setAddress({ ...values, tarif });
        next();
      }}
      validate={(values) => {
        const errors = {};
        if (!values.departureCity) errors.departureCity = "Ville de départ requise";
        if (!values.arrivalCity) errors.arrivalCity = "Ville d'arrivée requise";
        if (!values.date) {
          errors.date = "Veuillez sélectionner une date";
        } else {
          const today = new Date();
          const selectedDate = new Date(values.date);
          if (selectedDate < today) {
            errors.date = "La date ne peut pas être inférieure à aujourd'hui";
          }
        }
        return errors;
      }}
    >
      {({ handleSubmit, errors, values, handleChange, setFieldValue }) => (
        <div className="details__wrapper">
          <div className="form__row" style={{ display: "flex", gap: "1rem" }}>
            {/* Sélection de la ville de départ */}
            <div className={`form__item ${errors.departureCity && "input__error"}`} style={{ flex: 1 }}>
              <label>Ville de départ *</label>
              <Select
                name="departureCity"
                value={values.departureCity}
                onChange={handleChange}
                fullWidth
                style={{ height: "35px" }}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              <p className="error__feedback">{errors.departureCity}</p>
            </div>

            {/* Sélection de la ville d'arrivée */}
            <div className={`form__item ${errors.arrivalCity && "input__error"}`} style={{ flex: 1 }}>
              <label>Ville d'arrivée *</label>
              <Select
                name="arrivalCity"
                value={values.arrivalCity}
                onChange={handleChange}
                fullWidth
                style={{ height: "35px" }}
              >
                {cities
                  .filter((city) => city !== values.departureCity) // Exclure la ville de départ
                  .map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
              </Select>
              <p className="error__feedback">{errors.arrivalCity}</p>
            </div>

            {/* Sélection de la date */}
            <div className={`form__item ${errors.date && "input__error"}`} style={{ flex: 1 }}>
              <label>Date du voyage *</label>
              <div className="date-input-wrapper" style={{ position: "relative" }}>
                <DatePicker
                  selected={values.date ? new Date(values.date) : null}
                  onChange={(date) => setFieldValue("date", date ? date.toISOString() : "")}
                  className="form-control"
                  placeholderText="Date/"
                />
                <FaCalendarAlt
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "18px",
                    color: "#ccc",
                  }}
                />
              </div>
              <p className="error__feedback">{errors.date}</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="form__item button__items d-flex justify-content-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Next
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default StepOne;
