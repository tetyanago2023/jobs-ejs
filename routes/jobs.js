// routes/jobs.js

const express = require("express");
const router = express.Router();

const {
    getAllJobs,
    showJob,       // Added "Show Job" handler
    showJobForm,   // Handles both new and edit forms
    createJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

// List of jobs and create job
router.route("/")
    .get(getAllJobs) // Render jobs list
    .post(createJob); // Create a new job

// Form handler for adding or editing a job (optional :id for editing)
router.get("/form/:id?", showJobForm);

// Show a specific job
router.get("/:id", showJob); // New route to show a job

// Update job
router.post("/update/:id", updateJob);

// Delete job
router.post("/delete/:id", deleteJob);

module.exports = router;
