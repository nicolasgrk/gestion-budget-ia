import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/card';

interface Transaction {
  id: string;
  dateOp: Date;
  label: string;
  amount: number;
  category: string | null;
  categoryParent: string | null;
  accountNum: string;
  accountLabel: string;
}

interface Category {
  parent: string;
  subCategories: string[];
}

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const TransactionModal = ({ transaction, isOpen, onClose, onSave }: TransactionModalProps) => {
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(transaction);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>(transaction?.categoryParent || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  if (!editedTransaction) return null;

  const handleSave = async () => {
    if (editedTransaction) {
      try {
        const response = await fetch(`/api/transactions/${editedTransaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedTransaction),
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour');

        onSave(editedTransaction);
        onClose();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const subCategories = categories.find(cat => cat.parent === selectedParent)?.subCategories || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier la transaction"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/60 mb-1">Label</label>
          <input
            type="text"
            value={editedTransaction.label}
            onChange={(e) => setEditedTransaction({
              ...editedTransaction,
              label: e.target.value
            })}
            className="w-full glass bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Catégorie parent</label>
          <select
            value={editedTransaction.categoryParent || ''}
            onChange={(e) => {
              const newParent = e.target.value;
              setSelectedParent(newParent);
              setEditedTransaction({
                ...editedTransaction,
                categoryParent: newParent,
                category: '' // Réinitialiser la sous-catégorie
              });
            }}
            className="w-full glass bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(cat => (
              <option key={cat.parent} value={cat.parent}>
                {cat.parent}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">Sous-catégorie</label>
          <select
            value={editedTransaction.category || ''}
            onChange={(e) => setEditedTransaction({
              ...editedTransaction,
              category: e.target.value
            })}
            className="w-full glass bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90"
            disabled={!editedTransaction.categoryParent}
          >
            <option value="">Sélectionner une sous-catégorie</option>
            {subCategories.map(subCat => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSave = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
  };

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <Card className="glass p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-2 text-sm font-medium text-white/60">Date</th>
              <th className="pb-2 text-sm font-medium text-white/60">Label</th>
              <th className="pb-2 text-sm font-medium text-white/60">Montant</th>
              <th className="pb-2 text-sm font-medium text-white/60">Catégorie</th>
              <th className="pb-2 text-sm font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-white/60">
                  Chargement...
                </td>
              </tr>
            ) : currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-white/60">
                  Aucune transaction trouvée
                </td>
              </tr>
            ) : (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/5">
                  <td className="py-3 text-sm text-white/80">
                    {format(new Date(transaction.dateOp), 'dd/MM/yyyy', { locale: fr })}
                  </td>
                  <td className="py-3 text-sm text-white/80">{transaction.label}</td>
                  <td className={`py-3 text-sm font-medium ${
                    transaction.amount < 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {transaction.amount.toFixed(2)} €
                  </td>
                  <td className="py-3 text-sm text-white/80">
                    {transaction.categoryParent} 
                    {transaction.category && ` › ${transaction.category}`}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-2 py-1 rounded transition-colors"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white/80 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm text-white/60">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white/80 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTransaction(null);
          }}
          onSave={handleSave}
        />
      )}
    </Card>
  );
} 