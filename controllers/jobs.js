// controllers/jobs.js

const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");

// const getAllJobs = async (req, res, next) => {
//     try {
//         const jobs = await Job.find({ createdBy: req.user.id });
//         console.log(jobs, req.user.userId)
//         res.render("jobs", { jobs });
//     } catch (error) {
//         next(error);
//     }
// };

const getAllJobs = async (req, res, next) => {
    try {
        // Validate the presence of req.user and its id or userId
        if (!req.user || !req.user.id) {
            throw new Error("User information is missing.");
        }

        // Fetch jobs created by the user
        // const jobs = await Job.find({ createdBy: req.user.id }).exec();
        const jobs = await Job.find({ createdBy: req.user.id }).sort('createdAt');
        console.log(jobs, req.user.id);

        // Render the jobs list
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
