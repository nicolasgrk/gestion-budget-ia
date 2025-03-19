import { NextResponse } from "next/server";
import { analyzePurchaseFeasibility } from "@/app/lib/agents/forecast-agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemName, targetPrice, currentBalance } = body;

    if (!itemName || !targetPrice || !currentBalance) {
      return NextResponse.json(
        { error: 'Informations manquantes pour l\'analyse' },
        { status: 400 }
      );
    }

    const result = await analyzePurchaseFeasibility({
      itemName,
      targetPrice,
      currentBalance
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analyse de faisabilité terminée',
      analysis: result.analysis
    });
  } catch (error) {
    console.error('Erreur API planification achat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse de faisabilité' },
      { status: 500 }
    );
  }
} 