import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const modules = await prisma.module.findMany(); // url ya está incluido por defecto
  res.json(modules); // No se requiere cambio si se usa findMany() directo
});

// PUT /api/modules/:id - editar módulo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  try {
    const updated = await prisma.module.update({
      where: { id },
      data: { title, description, url }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar módulo' });
  }
});

// DELETE /api/modules/:id - eliminar módulo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.module.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar módulo' });
  }
});

export default router; 