import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useVaultContext } from '../../context/VaultContext';
import { VaultCard } from './VaultCard';
import { Vault, VaultCategory } from '../../types/vault';

interface VaultGridProps {
  onSelectVault: (vault: Vault) => void;
  onOpenCreateVault: () => void;
}

export const VaultGrid: React.FC<VaultGridProps> = ({
  onSelectVault,
  onOpenCreateVault,
}) => {
  const {
    vaults,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useVaultContext();

  const categories: { id: VaultCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Vaults' },
    { id: 'essential', label: 'Essential' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'growth', label: 'Growth' },
    { id: 'dream', label: 'Dream' },
  ];

  const filteredVaults = vaults.filter((v) => {
    if (v.isArchived) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.notes?.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vaults..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredVaults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => (
            <VaultCard key={vault.id} vault={vault} onSelect={onSelectVault} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-white dark:bg-zinc-800/50 border border-gray-200/80 dark:border-zinc-700/80 text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No active vaults found matching your filter.
          </p>
          <button
            onClick={onOpenCreateVault}
            className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create a Vault</span>
          </button>
        </div>
      )}
    </div>
  );
};
