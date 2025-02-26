const express = require("express");
const Planning = require("../models/Planning");
const auth = require("../middleware/auth");
const router = express.Router();
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A PLANNING
// CREATE A PLANNING
router.post(
  "/create",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log("Données reçues avant validation:", req.body);

      // Vérifier si un des trajets est déjà affecté pour ce jour
      const trajetExistant = await Planning.findOne({
        jour: req.body.jour,
        trajets: { $in: req.body.trajets } // Vérifie si l'un des trajets existe déjà dans ce jour
      });

      if (trajetExistant) {
        return next(new Errors("Un ou plusieurs trajets sont déjà affectés à ce planning.", 400));
      }

      // Créer un nouveau planning ou ajouter les trajets
      const planning = new Planning(req.body);
      await planning.validate();

      console.log("Données validées. Enregistrement en cours...");
      const response = await planning.save();

      req.app.get("socketio").emit("planning:update", { type: "create", planning: response });

      res.status(201).json({ success: true, message: "Planning créé avec succès", planning: response });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      next(new Errors(error.message || "Erreur lors de la création du planning", 400));
    }
  })
);


module.exports = router;
