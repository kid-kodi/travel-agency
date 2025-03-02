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

// GET ALL PLANNINGS WITH TRAJET INFO
router.get(
  "/all",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const plannings = await Planning.find().populate("trajets");

      // Émettre un événement pour mettre à jour les plannings côté client
      req.app.get("socketio").emit("planning:update", { type: "fetch", plannings });

      res.status(200).json({ success: true, plannings });
    } catch (error) {
      console.error("Erreur lors de la récupération des plannings:", error);
      next(new Errors(error.message || "Erreur lors de la récupération des plannings", 400));
    }
  })
);


// DELETE A TRAJET FROM A PLANNING
router.delete(
  "/planning/:planningId/trajet/:trajetId",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const { planningId, trajetId } = req.params;

      // Vérifier si le planning existe
      const planning = await Planning.findById(planningId);
      if (!planning) {
        return next(new Errors("Planning introuvable.", 404));
      }

      // Vérifier si le trajet est déjà affecté au planning
      if (!planning.trajets.includes(trajetId)) {
        return next(new Errors("Le trajet n'est pas affecté à ce planning.", 400));
      }

      // Retirer le trajet du planning
      planning.trajets = planning.trajets.filter(trajet => trajet.toString() !== trajetId);
      await planning.save();

      // Émettre un événement WebSocket pour informer la suppression
      req.app.get("socketio").emit("planning:update", { type: "delete_trajet", planningId, trajetId });

      res.status(200).json({ success: true, message: "Trajet supprimé du planning avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression du trajet:", error);
      next(new Errors(error.message || "Erreur lors de la suppression du trajet du planning", 400));
    }
  })
);



module.exports = router;
