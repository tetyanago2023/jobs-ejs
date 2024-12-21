// controllers/jobs.js

const Job = require("../models/Job");

const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.id });
        res.render("jobs", { jobs });
    } catch (error) {
        next(error);
    }
};

const showNewJobForm = (req, res) => {
    res.render("newJob"); // You’ll need a `views/newJob.ejs` form template
};

const createJob = async (req, res, next) => {
    try {
        const { company, position, status } = req.body;
        await Job.create({
            company,
            position,
            status,
            createdBy: req.user.id,
        });
        res.redirect("/jobs");
    } catch (error) {
        next(error);
    }
};

const showEditJobForm = async (req, res, next) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!job) {
            req.flash("error", "Job not found.");
            return res.redirect("/jobs");
        }
        res.render("editJob", { job, _csrf: req.csrfToken() }); // You’ll need a `views/editJob.ejs` template
    } catch (error) {
        next(error);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const { company, position, status } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { company, position, status },
            { new: true, runValidators: true }
        );
        if (!job) {
            req.flash("error", "Job not found.");
            return res.redirect("/jobs");
        }
        res.redirect("/jobs");
    } catch (error) {
        next(error);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!job) {
            req.flash("error", "Job not found.");
        }
        res.redirect("/jobs");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getJobs,
    showNewJobForm,
    createJob,
    showEditJobForm,
    updateJob,
    deleteJob,
};
