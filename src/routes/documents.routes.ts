import { Router } from 'express';
import { 
  createDocument, 
  getDocuments, 
  signDocument, 
  getDocument 
} from '../controllers/documents.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const router = Router();

router.use(authenticate);

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.post('/:id/sign', signDocument);