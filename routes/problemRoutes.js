import express from 'express';
import problemController from '../controllers/problemController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all problems, get by id
router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblemById);

// Admin only: Create, update, delete
router.post('/', authenticate, requireAdmin, problemController.createProblem);
router.put('/:id', authenticate, requireAdmin, problemController.updateProblem);
router.delete('/:id', authenticate, requireAdmin, problemController.deleteProblem);

export default router;
