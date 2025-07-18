import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const assignments = await prisma.assignment.findMany();
  res.json(assignments);
});

export default router; 