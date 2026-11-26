import express from 'express';
import { create,
         getAll,
         getById
 } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);

export default router;