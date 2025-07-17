import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const classes = await prisma.class.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      module: { select: { title: true } },
      teacher: { select: { firstName: true, lastName: true } },
      teacherId: true
    }
  });
  res.json(classes);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { teacherId } = req.body;
  try {
    const updated = await prisma.class.update({
      where: { id },
      data: { teacherId }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la clase' });
  }
});

export default router; 