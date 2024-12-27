// routes/jobs.js

const express = require("express");
const router = express.Router();

const {
    getAllJobs,
    showJobForm, // Handles both new and edit forms
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

// Update job
router.post("/update/:id", updateJob);

// Delete job
router.post("/delete/:id", deleteJob);

module.exports = router;
