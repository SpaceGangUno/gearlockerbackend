import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as authRoutes } from './routes/auth.routes.js';
import { router as documentRoutes } from './routes/documents.routes.js';
import { router as scheduleRoutes } from './routes/schedule.routes.js';
import { router as salesRoutes } from './routes/sales.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/sales', salesRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});