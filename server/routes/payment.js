const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");
const { resolve } = require("path");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

// Route pour récupérer la clé publique Stripe
router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// Route pour créer un paiement
router.post("/create-payment-intent",  async (req, res) => {
  try {
     const { amount } = req.body; // Permettre de passer le montant dynamiquement
    // const amount = 5000;
    if (!amount) {
      return res.status(400).send({ error: { message: "Montant requis" } });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount, // Montant en centimes
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(400).send({ error: { message: e.message } });
  }
});

module.exports = router;
