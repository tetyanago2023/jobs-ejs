// controllers/jobs.js

const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");

const getAllJobs = async (req, res, next) => {
    try {
        // Validate the presence of req.user
        if (!req.user || !req.user.id) {
            throw new Error("User information is missing.");
        }

        // Extract page and limit from query parameters
        const page = parseInt(req.query.page, 10) || 1;
        // const limit = parseInt(req.query.limit, 10) || 10;
        const limit = parseInt(req.query.limit, 10) || 5;
        const skip = (page - 1) * limit;

        // Fetch jobs with pagination
        const jobs = await Job.find({ createdBy: req.user.id })
            .sort('createdAt')
            .skip(skip)
            .limit(limit);

        // Get total count of jobs for pagination metadata
        const totalJobs = await Job.countDocuments({ createdBy: req.user.id });
        const totalPages = Math.ceil(totalJobs / limit);

        // Render the jobs list with pagination data
        res.render("jobs", {
            jobs,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            limit,
        });
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

const showJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!job) {
            req.flash("error", "Job not found.");
            return res.redirect("/jobs");
        }
        res.render("showJob", { job, viewOnly: true, _csrf: res.locals._csrf }); // use 'showJob' here
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
        res.render("editJob", { job, _csrf: res.locals._csrf }); // Use res.locals._csrf instead
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
    getAllJobs,
    showNewJobForm,
    showJob,
    createJob,
    showEditJobForm,
    updateJob,
    deleteJob,
};
