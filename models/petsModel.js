const mongoose = require("mongoose");

const petsSchema = new mongoose.Schema({
  id: { type: Number },
  type: { type: String },
  name: { type: String },
  adoptionStatus: {type: String},
  picture : {type: String},
  height: {type: Number},
  weight: {type: Number},
  color: {type: String},
  bio: {type: String},
  hypoallergenic: {type: Boolean},
  dietaryRestrictions: {type: String},
  breed: {type: String},
});

module.exports = Pets = mongoose.model("pets", petsSchema);
