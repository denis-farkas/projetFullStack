const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentNumber: { type: Number, unique: true, required: true },
  lastName: { type: String, required: true, uppercase: true, trim: true },
  firstNames: {
    type: [String],
    required: true,
    set: (names) => names.map((n) => n.trim().charAt(0).toUpperCase() + n.slice(1).toLowerCase()),
    get: (names) => names.join(", "),
  },
});

module.exports = mongoose.model("Student", studentSchema);
