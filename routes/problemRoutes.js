const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Public: Get all problems, get by id
router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblemById);

// Admin only: Create, update, delete
router.post('/', authenticate, requireAdmin, problemController.createProblem);
router.put('/:id', authenticate, requireAdmin, problemController.updateProblem);
router.delete('/:id', authenticate, requireAdmin, problemController.deleteProblem);

module.exports = router;
