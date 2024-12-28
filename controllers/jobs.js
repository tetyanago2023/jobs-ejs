// controllers/jobs.js

const Job = require("../models/Job");

const getAllJobs = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            throw new Error("User information is missing.");
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const companyFilter = req.query.company || '';
        const positionFilter = req.query.position || '';
        const statusFilter = req.query.status || '';

        const jobs = await Job.find({
            createdBy: req.user.id,
            company: { $regex: companyFilter, $options: 'i' },
            position: { $regex: positionFilter, $options: 'i' },
            status: { $regex: statusFilter, $options: 'i' }
        })
            .sort('createdAt')
            .skip(skip)
            .limit(limit);

        const totalJobs = await Job.countDocuments({
            createdBy: req.user.id,
            company: { $regex: companyFilter, $options: 'i' },
            position: { $regex: positionFilter, $options: 'i' },
            status: { $regex: statusFilter, $options: 'i' }
        });

        const totalPages = Math.ceil(totalJobs / limit);

        res.render("jobs", {
            jobs,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            limit,
            companyFilter,
            positionFilter,
            statusFilter
        });
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
        res.render("showJob", { job, _csrf: res.locals._csrf });
    } catch (error) {
        next(error);
    }
};

const showJobForm = async (req, res, next) => {
    try {
        if (req.params.id) {
            const job = await Job.findOne({ _id: req.params.id, createdBy: req.user.id });
            if (!job) {
                req.flash("error", "Job not found.");
                return res.redirect("/jobs");
            }
            return res.render("job", { job, _csrf: res.locals._csrf });
        }
        // Render form for a new job
        res.render("job", { job: null, _csrf: res.locals._csrf });
    } catch (error) {
        req.flash("error", "An unexpected error occurred.");
        return next(error);
    }
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
    showJob,       // Exported showJob function
    showJobForm,
    createJob,
    updateJob,
    deleteJob,
};
