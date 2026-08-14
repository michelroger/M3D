import React from 'react';
import type { CustomMaterial } from '../types';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedMaterial: string;
  onSelectMaterial: (material: string) => void;
  materials: CustomMaterial[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'title';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'title') => void;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'Tudo', icon: '🌐' },
  { id: 'organizer', label: 'Organizadores', icon: '📦' },
  { id: 'decor', label: 'Decoração', icon: '🏺' },
  { id: 'geek', label: 'Geek & Action', icon: '🐉' },
  { id: 'cosplay', label: 'Cosplay & Props', icon: '🛡️' },
  { id: 'mechanical', label: 'Mecânica', icon: '⚙️' },
  { id: 'functional', label: 'Peças Úteis', icon: '🔧' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedMaterial,
  onSelectMaterial,
  materials = [],
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filamento:
          </span>

          <button
            onClick={() => onSelectMaterial('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedMaterial === 'all'
                ? 'bg-slate-800 text-white border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos
          </button>

          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onSelectMaterial(mat.name)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedMaterial === mat.name
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-slate-950 text-slate-300 text-xs rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="featured">Mais Populares</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="title">Nome (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
