// routes/jobs.js

const express = require("express");
const router = express.Router();

const {
    getAllJobs,
    showJob,       // Handles showing a specific job
    showJobForm,   // Handles both new and edit forms
    createJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

// List of jobs and create job
router.route("/")
    .get(getAllJobs) // Render jobs list with pagination and filtering
    .post(createJob); // Create a new job

// Form handler for adding or editing a job (optional :id for editing)
router.get("/form/:id?", showJobForm);

// Show a specific job
router.get("/:id", showJob);

// Update a job
router.post("/update/:id", updateJob);

// Delete a job
router.post("/delete/:id", deleteJob);

module.exports = router;
