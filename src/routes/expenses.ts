import express from 'express';
import { PrismaClient } from '../generated/prisma';
import authMiddleware from '../middlewares/auth';

const router = express.Router();
const prisma = new PrismaClient();

// CREATE - Ajouter une dépense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, categoryId, description } = req.body;
    const userId: string = req.userId!;

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount as string),
        categoryId: categoryId,
        userId: userId,
        description: description || undefined,
      },
      include: {
        category: true,
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Erreur ajout dépense:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la dépense' });
  }
});

// READ - Récupérer toutes les dépenses de l'user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId: string = req.userId!;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(expenses);
  } catch (error) {
    console.error('Erreur récupération dépenses:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des dépenses' });
  }
});

// READ - Récupérer une dépense spécifique
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId: string = req.userId!;

    const expense = await prisma.expense.findFirst({
      where: { id: id as string, userId },
      include: {
        category: true,
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Dépense non trouvée' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Erreur récupération dépense:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la dépense' });
  }
});

// UPDATE - Modifier une dépense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, categoryId, description } = req.body;
    const userId: string = req.userId!;

    // Vérifier que la dépense appartient bien à l'user
    const expense = await prisma.expense.findFirst({
      where: { id: id as string, userId }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Dépense non trouvée' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: id as string },
      data: {
        amount: amount ? parseFloat(amount as string) : expense.amount,
        categoryId: categoryId || expense.categoryId,
        description: description !== undefined ? description : expense.description,
      },
      include: {
        category: true,
      }
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error('Erreur modification dépense:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de la dépense' });
  }
});

// DELETE - Supprimer une dépense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId: string = req.userId!;

    // Vérifier que la dépense appartient bien à l'user
    const expense = await prisma.expense.findFirst({
      where: { id: id as string, userId }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Dépense non trouvée' });
    }

    await prisma.expense.delete({
      where: { id: id as string }
    });

    res.json({ message: 'Dépense supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression dépense:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la dépense' });
  }
});

export default router;