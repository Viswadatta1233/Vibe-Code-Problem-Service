import Problem from '../models/Problem.js';

// Create a new problem (admin only)
export const createProblem = async (req, res) => {
    try {
        const problem = new Problem({ ...req.body, createdBy: req.user._id });
        await problem.save();
        res.status(201).json(problem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all problems
export const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().populate('createdBy', 'name email');
        res.json(problems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single problem by ID
export const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate('createdBy', 'name email');
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a problem (admin only)
export const updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json(problem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a problem (admin only)
export const deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        res.json({ message: 'Problem deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
