import express from 'express';
import { PrismaClient } from '../generated/prisma';
import authMiddleware from '../middlewares/auth';

const router = express.Router();
const prisma = new PrismaClient();

// CREATE - Créer une catégorie
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, icon } = req.body;
    const userId: string = req.userId!;

    const category = await prisma.category.create({
      data: {
        name,
        icon: icon || undefined,
        userId: userId,
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
  }
});

// READ - Récupérer toutes les catégories de l'user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId: string = req.userId!;

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

// UPDATE - Modifier une catégorie
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    const userId: string = req.userId!;

    // Vérifier que la catégorie appartient bien à l'user
    const category = await prisma.category.findFirst({
      where: { id: id as string, userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: id as string, userId },
      data: {
        name: name || category.name,
        icon: icon !== undefined ? icon : category.icon,
      }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Erreur modification catégorie:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de la catégorie' });
  }
});

// DELETE - Supprimer une catégorie
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId: string = req.userId!;

    // Vérifier que la catégorie appartient bien à l'user
    const category = await prisma.category.findFirst({
      where: { id: id as string, userId: userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    await prisma.category.delete({
      where: { id: id as string, userId: userId }
    });

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
  }
});

export default router;