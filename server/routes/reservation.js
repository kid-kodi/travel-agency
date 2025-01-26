const express = require("express");
const Reservation = require("../models/Reservation");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");


// CREATE A RESERVATION
router.post(
    "/create",
    auth,
    CatchAsyncError(async (req, res, next) => {
      try {
        const reservation = new Reservation(req.body);
        reservation.user = req.user._id;
        const response = await reservation.save();
  
        res.status(201).json({
          success: true,
          message: "Réservation créée avec succès ",
          reservation: response,
        });
      } catch (error) {
        next(new Errors("Erreur lors de la création de la réservation", 400));
      }
    })
  );
  

// GET RESERVATIONS WITH SEARCH AND PAGINATION
router.get(
  "/search",
  CatchAsyncError(async (req, res, next) => {
    try {
      let keyword = req.query.q
        ? { departureCity: { $regex: req.query.q, $options: "i" } }
        : {};
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.size) || 5;
      const count = await Reservation.countDocuments({ ...keyword });
      const pages = Math.ceil(count / pageSize);
      const reservations = await Reservation.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort("-createdAt");
      res.status(200).json({ success: true, reservations, page, pages });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des réservations", 400));
    }
  })
);

// GET ALL RESERVATIONS
router.get(
  "/",
  CatchAsyncError(async (req, res, next) => {
    try {
      let reservations = await Reservation.find();
      res.status(200).json({ success: true, reservations });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération des réservations", 400));
    }
  })
);

// GET A SINGLE RESERVATION
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));
      res.status(200).json({ success: true, reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la récupération de la réservation", 400));
    }
  })
);

// UPDATE A RESERVATION
router.put(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));
      res.status(200).json({ success: true, message: "Modification effectuée", reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la modification de la réservation", 400));
    }
  })
);

// DELETE MULTIPLE RESERVATIONS
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await Reservation.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ success: true, message: "Réservations supprimées avec succès", response });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression des réservations", 400));
    }
  })
);

// DELETE A RESERVATION
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
      if (!reservation) return next(new Errors("Réservation non trouvée", 404));
      res.status(200).json({ success: true, message: "Réservation supprimée", reservation });
    } catch (error) {
      next(new Errors("Erreur lors de la suppression de la réservation", 400));
    }
  })
);

// IMPORT RESERVATIONS FROM EXCEL FILE
router.post(
  "/import",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return next(new Errors("Les données n'ont pas pu être téléchargées", 400));
        }
        const { data } = excelToJson({
          sourceFile: files.excelFile.filepath,
          columnToKey: {
            A: "departureCity",
            B: "arrivalCity",
            C: "date",
            D: "tarif",
            E: "horaire",
            F: "seatNumber",
          },
        });
        const reservations = await Promise.all(
          data.map(async (d) => {
            const reservation = new Reservation(d);
            reservation.user = req.user._id;
            return await reservation.save();
          })
        );
        res.status(201).json({ success: true, message: "Réservations importées avec succès", reservations });
      });
    } catch (error) {
      next(new Errors("Erreur lors de l'importation des réservations", 400));
    }
  })
);

module.exports = router;

