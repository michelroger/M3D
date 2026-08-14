import React from 'react';
import { Box, Heart, MessageSquare, ShieldCheck, GitBranch } from 'lucide-react';
import type { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="mt-16 w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
              <Box className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">{settings.storeName}</span>
          </div>

          <p className="text-slate-400 max-w-md font-normal leading-relaxed">
            Plataforma Maker para orçamento rápido e prototipagem de peças 3D em alta precisão. 
            Desenvolvido para hospedagem estática e segura no GitHub Pages.
          </p>

          <div className="flex items-center gap-2 pt-1 text-slate-500 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dados Privados de Custos Criptografados no Client-Side</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-mono text-white font-bold uppercase tracking-wider text-[11px]">Atendimento WhatsApp</h4>
          <p className="text-slate-400">Solicite orçamentos para arquivos STL próprios ou modelos da nossa vitrine.</p>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enviar WhatsApp</span>
          </a>
        </div>

        <div className="space-y-3">
          <h4 className="font-mono text-white font-bold uppercase tracking-wider text-[11px]">Área Maker</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenAdmin} className="hover:text-orange-400 transition-colors">
                Painel Administrativo Restrito
              </button>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Hospedado no GitHub Pages</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <p>© {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Feito com <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> para Makers e Entusiastas 3D
        </p>
      </div>
    </footer>
  );
};
