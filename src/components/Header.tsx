import React from 'react';
import { Box, Search, ShieldLock, MessageSquare, Sparkles } from 'lucide-react';
import type { StoreSettings } from '../types';
import { APP_VERSION } from '../config/version';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdmin: () => void;
  onOpenCostCalc: () => void;
  settings: StoreSettings;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  onOpenCostCalc,
  settings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* LOGO & BRANDING */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all">
            <Box className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Mr3D
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-md uppercase">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Impressão 3D & Orçamentos sob Medida</p>
          </div>
        </div>

        {/* CAMPO DE BUSCA RÁPIDA */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar modelos 3D, capacetes, organizadores..."
              className="w-full bg-slate-900/90 text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* BOTÕES DE AÇÃO E ADMIN */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>

          <button
            onClick={onOpenCostCalc}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Calculadora Interna de Custos de Impressão"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Calculadora 3D</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <ShieldLock className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Área Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
