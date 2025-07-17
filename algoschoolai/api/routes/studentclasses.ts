import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /api/studentclasses
router.get('/', async (_req, res) => {
  try {
    const studentclasses = await prisma.studentClass.findMany({
      include: {
        student: { select: { id: true, firstName: true, lastName: true, email: true } },
        class: { select: { id: true, title: true, description: true } }
      }
    });
    res.json(studentclasses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

export default router; 