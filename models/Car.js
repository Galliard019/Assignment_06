const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  imageUrl: { type: String, required: true },
  returnDate: { type: String, default: "" },
  rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

module.exports = mongoose.model("Car", carSchema);
