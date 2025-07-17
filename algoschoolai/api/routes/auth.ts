import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    // No enviar password al frontend
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  console.log('[REGISTER] Incoming data:', { email, firstName, lastName, role });
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    console.log('[REGISTER] User exists?', !!exists);
    if (exists) {
      console.log('[REGISTER] Email already registered:', email);
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const hashed = await bcrypt.hash(password, 10);
    console.log('[REGISTER] Password hashed');
    const user = await prisma.user.create({
      data: { email, password: hashed, firstName, lastName, role }
    });
    console.log('[REGISTER] User created:', user);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
    console.log('[REGISTER] Registration successful, response sent');
  } catch (error) {
    console.error('[REGISTER] Error in registration:', error);
    res.status(500).json({ error: 'Error en registro' });
  }
});

export default router; 