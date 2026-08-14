import React from 'react';
import type { Product } from '../types';
import { Box, Sparkles, MessageCircle, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
    >
      <div className="relative w-full h-52 bg-slate-950 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>DESTAQUE MAKER</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
          <Box className="w-3 h-3" />
          <span>3D READY</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto">
            {product.availableMaterials.slice(0, 3).map((mat) => (
              <span
                key={mat}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {mat}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-normal leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {product.availableColors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-inner"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.availableColors.length > 4 && (
              <span className="text-[10px] font-mono text-slate-500 ml-1">
                +{product.availableColors.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {product.printTimeHours}h
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block">A PARTIR DE</span>
            <span className="text-lg font-black text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text">
              R$ {product.basePrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Orçar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
