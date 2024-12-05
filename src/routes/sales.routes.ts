import { Router } from 'express';
import { 
  getSales,
  getSalesByDateRange
} from '../controllers/sales.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const router = Router();

router.use(authenticate);

router.get('/', getSales);
router.get('/range', getSalesByDateRange);