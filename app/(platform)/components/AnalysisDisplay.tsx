interface AnalysisData {
  tendances: {
    titre: string;
    description: string;
    categories: Array<{
      nom: string;
      montant: string;
      pourcentage: string;
      variation: string;
    }>;
  };
  optimisations: {
    titre: string;
    suggestions: Array<{
      categorie: string;
      montant: string;
      description: string;
    }>;
  };
  habitudes: {
    titre: string;
    tags: string[];
    description: string;
  };
  suggestions: {
    titre: string;
    actions: Array<{
      titre: string;
      description: string;
      montant?: string;
    }>;
  };
}

interface AnalysisDisplayProps {
  analysis: AnalysisData;
}

export function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  return (
    <div className="h-[250px] sm:h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="space-y-4">
        {/* Tendances */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-400">{analysis.tendances.titre}</h4>
          <p className="text-sm text-white/80">{analysis.tendances.description}</p>
          <div className="space-y-1">
            {analysis.tendances.categories.map((cat, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <div>
                  <span className="font-medium text-white">{cat.nom}</span>
                  <span className="text-sm text-white/60"> - {cat.montant} ({cat.pourcentage})</span>
                  <span className={`text-xs ml-2 ${
                    cat.variation.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {cat.variation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimisations */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-400">{analysis.optimisations.titre}</h4>
          <ul className="space-y-1">
            {analysis.optimisations.suggestions.map((sugg, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <div>
                  <span className="font-medium text-white">{sugg.categorie}</span>
                  <span className="text-sm text-white/60"> - {sugg.description}</span>
                  {sugg.montant && (
                    <span className="text-emerald-400 font-medium ml-1">{sugg.montant}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Habitudes */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-400">{analysis.habitudes.titre}</h4>
          <p className="text-sm text-white/80 mb-2">{analysis.habitudes.description}</p>
          <div className="flex gap-2 flex-wrap">
            {analysis.habitudes.tags.map((tag, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded-full text-xs ${
                  index % 3 === 0 ? 'bg-purple-500/20 text-purple-400' :
                  index % 3 === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions stratégiques */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-400">{analysis.suggestions.titre}</h4>
          <div className="bg-white/5 rounded-lg p-3">
            <ul className="space-y-2">
              {analysis.suggestions.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <div>
                    <span className="text-sm text-white/80">
                      {action.description}
                      {action.montant && (
                        <span className="text-emerald-400 font-medium ml-1">{action.montant}</span>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 