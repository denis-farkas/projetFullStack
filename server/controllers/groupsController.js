const Group = require("../models/Group");

exports.createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("student");
    res.json(groups);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).send("Groupe non trouvé");
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).send("Groupe non trouvé");
    res.json({ message: "Étudiant retiré du groupe" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentsByGroup = async (req, res) => {
  try {
    const groupNumber = req.params.groupNumber;
    const groupMembers = await Group.find({
      groupNumber: groupNumber,
    }).populate("student");
    res.json(groupMembers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all unassigned students
exports.getUnassignedStudents = async (req, res) => {
  try {
    const Student = require("../models/Student");

    // Find all student IDs that are assigned to groups
    const assignedStudentIds = await Group.distinct("student");

    // Find students that aren't in any group
    const unassignedStudents = await Student.find({
      _id: { $nin: assignedStudentIds },
    });

    res.json(unassignedStudents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
