import express from 'express';
import authRoutes from './authRoutes.js';
import queryRoutes from './queryRoutes.js';
import insightRoutes from './insightRoutes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the Nexus Genesis API');
});

router.use('/auth', authRoutes);
router.use('/query', queryRoutes);
router.use('/insights', insightRoutes);



export default router;