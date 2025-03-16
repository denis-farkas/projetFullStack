const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  try {
    const { studentNumber, lastName, firstNames } = req.body;
    const student = new Student({ studentNumber, lastName, firstNames });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send("Étudiant non trouvé");
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { lastName, firstNames } = req.body;

    // Process firstNames if it's a string
    let processedFirstNames = firstNames;
    if (typeof firstNames === "string") {
      processedFirstNames = firstNames.split(",").map((name) => name.trim());
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { lastName, firstNames: processedFirstNames },
      { new: true } // Return updated document
    );

    if (!student) return res.status(404).send("Étudiant non trouvé");
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
