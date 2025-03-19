import { NextResponse } from "next/server";
import { analyzeSpending } from "@/app/lib/agents/analysis-agent";

export async function POST() {
  try {
    const result = await analyzeSpending();
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analyse des dépenses terminée avec succès',
      analysis: result.analysis
    });
  } catch (error) {
    console.error('Erreur API analyse des dépenses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse des dépenses' }, 
      { status: 500 }
    );
  }
} 