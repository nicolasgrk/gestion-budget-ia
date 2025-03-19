import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
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