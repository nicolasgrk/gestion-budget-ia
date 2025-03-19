'use client';

import { useState } from 'react';

export default function CsvUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transactions/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du téléchargement');
      }

      setMessage({
        type: 'success',
        content: data.message
      });
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        type: 'error',
        content: error instanceof Error ? error.message : 'Erreur lors de l\'importation du fichier'
      });
    } finally {
      setIsUploading(false);
      // Réinitialiser le champ de fichier
      event.target.value = '';
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Importer un relevé bancaire</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csvFile"
          />
          <label
            htmlFor="csvFile"
            className={`cursor-pointer px-4 py-2 rounded text-white ${
              isUploading 
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isUploading ? 'Importation en cours...' : 'Sélectionner un fichier CSV'}
          </label>
        </div>
        
        {message && (
          <div className={`p-4 rounded ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message.content}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p className="font-medium">Format attendu du CSV :</p>
          <ul className="list-disc list-inside mt-2">
            <li>Séparateur : point-virgule (;)</li>
            <li>Colonnes requises : Date, Libellé, Montant</li>
            <li>Colonnes optionnelles : Compte, N° Compte</li>
            <li>Format de la date : JJ/MM/AAAA</li>
            <li>Format du montant : nombres avec virgule (ex: 42,50)</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 