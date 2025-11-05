import express from 'express';
import authRoutes from './authRoutes.js';
import queryRoutes from './queryRoutes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Nexus Genesis API');
});

router.use('/auth', authRoutes);
router.use('/query', queryRoutes);



export default router;