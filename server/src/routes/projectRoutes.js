import express from 'express';
import { create } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);    //This applies authentication middleware to all subsequently defined routes within this router, so we don't have to individually attach protect to every project endpoint.

router.post('/', create);

export default router;