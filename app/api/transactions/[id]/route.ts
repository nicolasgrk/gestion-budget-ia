import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const parsedId = parseInt(id);
    const data = await request.json();

    const updatedTransaction = await prisma.transaction.update({
      where: { id: parsedId },
      data: {
        label: data.label,
        category: data.category,
        categoryParent: data.categoryParent,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la transaction:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la transaction' },
      { status: 500 }
    );
  }
} 