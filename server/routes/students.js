const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Récupérer tous les étudiants
router.get("/all", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Ajouter un étudiant
router.post("/create", async (req, res) => {
  try {
    let { studentNumber, lastName, firstNames } = req.body;
    // Convert studentNumber to a numeric value if possible
    studentNumber = Number(studentNumber.replace(/[^0-9]/g, ""));

    // Convert firstNames string to array by splitting on commas
    firstNames = firstNames.split(",").map((name) => name.trim());

    const student = new Student({ studentNumber, lastName, firstNames });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un étudiant
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Étudiant supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let { lastName, firstNames } = req.body;

    // Process firstNames like you do in the create route
    if (typeof firstNames === "string") {
      firstNames = firstNames.split(",").map((name) => name.trim());
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { lastName, firstNames },
      { new: true }
    );

    if (!updatedStudent)
      return res.status(404).json({ message: "Étudiant non trouvé" });

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
