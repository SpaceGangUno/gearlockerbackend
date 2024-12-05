import { Router } from 'express';
import { 
  getSchedule, 
  updateSchedule 
} from '../controllers/schedule.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const router = Router();

router.use(authenticate);

router.get('/', getSchedule);
router.put('/', updateSchedule);