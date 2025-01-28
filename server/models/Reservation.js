const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    departureCity: { type: String, required: true },
    arrivalCity: { type: String, required: true },
    date: { type: Date, required: true },
    tarif: { type: Number, required: true },
    horaire: { type: String, required: true },
    seatNumber: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dateReservation: { type: Date, required: true, default: Date.now },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
