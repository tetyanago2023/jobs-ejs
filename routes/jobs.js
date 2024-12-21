// routes/jobs.js

const express = require("express");
const router = express.Router();

const {
    getJobs,
    showNewJobForm,
    showJob,
    createJob,
    showEditJobForm,
    updateJob,
    deleteJob,
} = require("../controllers/jobs");

router.route("/")
    .get(getJobs) // GET /jobs - List all jobs
    .post(createJob); // POST /jobs - Add a new job

router.get("/new", showNewJobForm); // GET /jobs/new - Show form to create a new job
router.get("/edit/:id", showEditJobForm); // GET /jobs/edit/:id - Show form to edit a job
router.get("/:id", showJob); // GET /jobs/:id - View a single job (Show job)
router.post("/update/:id", updateJob); // POST /jobs/update/:id - Update a job
router.post("/delete/:id", deleteJob); // POST /jobs/delete/:id - Delete a job

module.exports = router;
