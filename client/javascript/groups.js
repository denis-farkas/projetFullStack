import { buildElement, displayMessage } from "./tools.js";

// Base URL for API requests
const API_URL = "http://127.0.0.1:5000/api";
const TOTAL_GROUPS = 6;

// State management
let currentGroupView = "aucun";
let allStudents = [];
let groupAssignments = {};

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Set up group selection change event
  const groupSelect = document.getElementById("group-select");
  groupSelect.addEventListener("change", (e) => {
    currentGroupView = e.target.value;
    renderStudentTable();
  });

  // Initial data load
  loadAllData();
});

// Load all necessary data
const loadAllData = async () => {
  try {
    // Load all students
    const studentsResponse = await fetch(`${API_URL}/students/all`);
    if (!studentsResponse.ok) throw new Error("Failed to load students");
    allStudents = await studentsResponse.json();

    // Load all group assignments
    const groupsResponse = await fetch(`${API_URL}/groups/all`);
    if (!groupsResponse.ok) throw new Error("Failed to load groups");
    const groupData = await groupsResponse.json();

    // Process group data
    processGroupData(groupData);

    // Render the table
    renderStudentTable();
  } catch (error) {
    console.error("Error loading data:", error);
    displayMessage("Erreur lors du chargement des données", "error");
  }
};

// Process group data into a manageable format
const processGroupData = (groupData) => {
  // Reset group assignments
  groupAssignments = {};

  // Create an entry for each group
  for (let i = 1; i <= TOTAL_GROUPS; i++) {
    groupAssignments[i] = [];
  }

  // Process each assignment
  groupData.forEach((assignment) => {
    if (assignment.groupNumber && assignment.student) {
      groupAssignments[assignment.groupNumber].push({
        id: assignment._id,
        student: assignment.student._id,
        groupNumber: assignment.groupNumber,
      });
    }
  });
};

// Render the student table based on current view
const renderStudentTable = () => {
  const tableBody = document.getElementById("students-table-body");
  tableBody.innerHTML = "";
  const actionHeader = document.getElementById("action-header");

  if (currentGroupView === "aucun") {
    actionHeader.textContent = "Assigner au groupe";

    // Get students not in any group
    const assignedStudentIds = Object.values(groupAssignments)
      .flat()
      .map((a) => a.student);

    const unassignedStudents = allStudents.filter(
      (student) => !assignedStudentIds.includes(student._id)
    );

    unassignedStudents.forEach((student) => {
      renderStudentRow(tableBody, student);
    });
  } else {
    actionHeader.textContent = "Action";

    // Get students in selected group
    const groupNumber = currentGroupView;
    const studentsInGroup = groupAssignments[groupNumber] || [];

    // Find student details for each assignment
    studentsInGroup.forEach((assignment) => {
      const student = allStudents.find((s) => s._id === assignment.student);
      if (student) {
        renderStudentRow(tableBody, student, assignment.id);
      }
    });
  }
};

// Render a single student row
const renderStudentRow = (tableBody, student, assignmentId = null) => {
  // Create a row with student info
  const row = buildElement("tr", {});

  // Add student information cells

  row.appendChild(buildElement("td", {}, student.lastName));
  row.appendChild(
    buildElement(
      "td",
      {},
      Array.isArray(student.firstNames)
        ? student.firstNames.join(", ")
        : student.firstNames
    )
  );
  row.appendChild(buildElement("td", {}, student.studentNumber));
  // Create action cell based on current view
  let actionCell;

  if (currentGroupView === "aucun") {
    // Group circles for unassigned students
    const circlesContainer = buildElement("div", {
      className: "group-circles",
    });

    for (let i = 1; i <= TOTAL_GROUPS; i++) {
      const circle = buildElement(
        "button",
        {
          className: "group-circle",
          onClick: () => assignStudentToGroup(student._id, i),
        },
        i.toString()
      );

      circlesContainer.appendChild(circle);
    }

    actionCell = buildElement("td", {}, circlesContainer);
  } else {
    // Remove button for assigned students
    actionCell = buildElement(
      "td",
      {},
      buildElement(
        "button",
        {
          className: "remove-btn",
          onClick: () => removeStudentFromGroup(assignmentId),
        },
        "Effacer"
      )
    );
  }

  row.appendChild(actionCell);
  tableBody.appendChild(row);
};

// Assign a student to a group
const assignStudentToGroup = async (studentId, groupNumber) => {
  try {
    const response = await fetch(`${API_URL}/groups/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, groupNumber }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    displayMessage(`Étudiant assigné au groupe ${groupNumber}`, "success");
    loadAllData(); // Refresh data
  } catch (error) {
    console.error("Error assigning student:", error);
    displayMessage("Erreur lors de l'assignation au groupe", "error");
  }
};

// Remove a student from a group
const removeStudentFromGroup = async (assignmentId) => {
  try {
    const response = await fetch(`${API_URL}/groups/${assignmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    displayMessage("Étudiant retiré du groupe", "success");
    loadAllData(); // Refresh data
  } catch (error) {
    console.error("Error removing student from group:", error);
    displayMessage("Erreur lors du retrait du groupe", "error");
  }
};
