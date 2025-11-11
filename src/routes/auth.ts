import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

export default router;