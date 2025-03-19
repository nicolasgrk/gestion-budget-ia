import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer toutes les catégories parentes uniques
    const parentCategories = await prisma.category.findMany({
      distinct: ['parentName'],
      select: {
        parentName: true,
      }
    });

    // Pour chaque catégorie parente, récupérer ses sous-catégories
    const categoriesWithSubs = await Promise.all(
      parentCategories.map(async ({ parentName }) => {
        const subCategories = await prisma.category.findMany({
          where: {
            parentName: parentName
          },
          select: {
            name: true
          }
        });

        return {
          parent: parentName,
          subCategories: subCategories.map(sub => sub.name)
        };
      })
    );

    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
} 