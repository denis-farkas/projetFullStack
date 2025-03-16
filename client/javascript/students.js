import { buildElement, displayMessage } from "./tools.js";

let isEditMode = false;
let currentStudentId = null;

const init = () => {
  allStudents();

  // Handle add/edit button click based on current mode
  document.getElementById("addStudent").addEventListener("click", () => {
    if (isEditMode) {
      updateStudent();
    } else {
      createStudent();
    }
  });

  // Clear button should reset form mode too
  const clearButton = document.getElementById("clear");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      resetFormMode();
      emptyFields();
    });
  }

  emptyFields();
};

window.addEventListener("DOMContentLoaded", init);

const resetFormMode = () => {
  isEditMode = false;
  currentStudentId = null;
  document.getElementById("studentNumber").disabled = false;
  document.getElementById("addStudent").textContent = "Ajouter";
  document.querySelector("h2").textContent = "Ajouter un étudiant";
};

const switchToEditMode = (student) => {
  isEditMode = true;
  currentStudentId = student._id;

  // Update the form
  document.getElementById("studentNumber").value = student.studentNumber;
  document.getElementById("studentNumber").disabled = true;
  document.getElementById("lastName").value = student.lastName;

  // Safe handling of firstNames whether it's array or string
  document.getElementById("firstNames").value = Array.isArray(
    student.firstNames
  )
    ? student.firstNames.join(", ")
    : student.firstNames;

  // Update UI elements
  document.getElementById("addStudent").textContent = "Modifier";
  document.querySelector("h2").textContent = "Modifier un étudiant";
};

const updateStudent = async () => {
  try {
    const student = {
      lastName: document.getElementById("lastName").value,
      firstNames: document.getElementById("firstNames").value,
    };

    // Validate inputs
    if (!student.lastName || !student.firstNames) {
      displayMessage("Le nom et les prénoms sont obligatoires", "error");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    };

    const response = await fetch(
      `http://127.0.0.1:5000/api/students/${currentStudentId}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    displayMessage("Étudiant modifié avec succès", "success");
    resetFormMode();
    emptyFields();
    allStudents(); // Refresh the list
  } catch (error) {
    console.error("Error updating student:", error);
    displayMessage("Erreur lors de la modification de l'étudiant", "error");
  }
};

const allStudents = async () => {
  try {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      `http://127.0.0.1:5000/api/students/all`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const students = await response.json();
    fillStudentList(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    displayMessage("Erreur lors du chargement des étudiants", "error");
  }
};

const createStudent = async () => {
  try {
    const student = {
      studentNumber: document.getElementById("studentNumber").value,
      lastName: document.getElementById("lastName").value,
      firstNames: document.getElementById("firstNames").value,
    };

    // Validate inputs
    if (!student.studentNumber || !student.lastName || !student.firstNames) {
      displayMessage("Tous les champs sont obligatoires", "error");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    };

    const response = await fetch(
      `http://127.0.0.1:5000/api/students/create`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const createdStudent = await response.json();
    displayMessage("Étudiant ajouté avec succès", "success");
    emptyFields();
    allStudents(); // Refresh the list
  } catch (error) {
    console.error("Error creating student:", error);
    displayMessage("Erreur lors de l'ajout de l'étudiant", "error");
  }
};

const deleteStudent = async (id) => {
  try {
    const requestOptions = {
      method: "DELETE",
    };

    const response = await fetch(
      `http://127.0.0.1:5000/api/students/${id}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    displayMessage("Étudiant supprimé avec succès", "success");
    allStudents(); // Refresh the list
  } catch (error) {
    console.error("Error deleting student:", error);
    displayMessage("Erreur lors de la suppression", "error");
  }
};

const fillStudentList = (students) => {
  const studentList = document.getElementById("student-list");
  studentList.innerHTML = "";

  if (students.length === 0) {
    const emptyMessage = buildElement("li", {}, "Aucun étudiant trouvé");
    studentList.appendChild(emptyMessage);
    return;
  }

  students.forEach((student) => {
    // Create separate spans for each piece of information
    const numberSpan = buildElement(
      "span",
      { className: "student-number" },
      student.studentNumber
    );

    const lastNameSpan = buildElement(
      "span",
      { className: "student-lastname" },
      student.lastName
    );

    const firstNamesSpan = buildElement(
      "span",
      { className: "student-firstname" },
      Array.isArray(student.firstNames)
        ? student.firstNames.join(", ")
        : student.firstNames
    );

    // Create container for student information
    const studentInfo = buildElement("div", { className: "student-info" }, [
      numberSpan,
      lastNameSpan,
      firstNamesSpan,
    ]);

    // Create edit and delete buttons
    const editBtn = buildElement(
      "button",
      {
        className: "edit-btn",
        onClick: () => switchToEditMode(student),
      },
      "Modifier"
    );

    const deleteBtn = buildElement(
      "button",
      {
        className: "delete-btn",
        onClick: () => deleteStudent(student._id),
      },
      "Supprimer"
    );

    // Create action buttons container
    const actions = buildElement("div", { className: "student-actions" }, [
      editBtn,
      deleteBtn,
    ]);

    // Create list item and add both the info and buttons
    const listItem = buildElement("li", {}, [studentInfo, actions]);

    // Add to the list
    studentList.appendChild(listItem);
  });
};

const emptyFields = () => {
  document.getElementById("studentNumber").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("firstNames").value = "";
};

// Removed duplicate event listeners
