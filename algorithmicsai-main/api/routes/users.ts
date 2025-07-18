import { Router } from 'express';
import prisma from '../prisma';
import { authenticateToken, canEditProfile, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/users - lista todos los usuarios (solo admin)
router.get('/', authenticateToken, requireRole(['admin']), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true   // <-- incluir notes
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET /api/users/:id - obtener perfil específico (solo el propio usuario o admin)
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    // Verificar permisos
    if (userId !== id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos para ver este perfil' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true   // <-- incluir notes
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// PUT /api/users/:id - actualizar datos del usuario (solo el propio usuario o admin)
router.put('/:id', authenticateToken, canEditProfile, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, avatar, status, notes } = req.body;
  
  try {
    // Verificar que el email no esté en uso por otro usuario
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email, avatar, status, notes }, // <-- permitir actualizar status y notes
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        createdAt: true,
        status: true, // <-- incluir status
        notes: true   // <-- incluir notes
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/users/:id - eliminar usuario (solo admin)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003' || (error.message && error.message.includes('Foreign key constraint failed'))) {
      return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene módulos asociados. Reasigna o elimina los módulos primero.' });
    }
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router; 