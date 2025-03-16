const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");

// Get all groups
router.get("/all", groupsController.getAllGroups);

// Add a student to a group
router.post("/add", (req, res) => {
  // Convert from client format to controller format
  const { studentId, groupNumber } = req.body;
  req.body = { student: studentId, groupNumber };

  groupsController.createGroup(req, res);
});

// Remove a student from a group
router.delete("/:id", groupsController.deleteGroup);

module.exports = router;
