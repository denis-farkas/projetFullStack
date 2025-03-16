const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  groupNumber: { type: Number, required: true, min: 1, max: 6 },
});

module.exports = mongoose.model("Group", groupSchema);
