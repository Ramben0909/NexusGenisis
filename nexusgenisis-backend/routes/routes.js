import express from 'express';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.send('Welcome to the Nexus Genesis API');
});

export default router;