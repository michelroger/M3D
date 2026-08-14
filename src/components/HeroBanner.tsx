import React from 'react';
import { Layers, ShieldCheck, Zap, Sparkles, Cpu } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 sm:p-10 mb-8 shadow-2xl">
      {/* Luzes de fundo Neon Estilo MakerWorld */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* TEXTO DE DESTAQUE */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTÚDIO MAKER DE IMPRESSÃO 3D</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Sua ideia materializada em <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
              Peças 3D de Alta Precisão
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
            Explore nossos modelos 3D exclusivos ou solicite a fabricação sob medida da sua própria peça. 
            Escolha cor, dimensão, material e receba o orçamento detalhado direto no seu WhatsApp em minutos.
          </p>

          {/* BADGES DE RECURSOS */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <Zap className="w-4 h-4 text-orange-400" />
              <span>Orçamento via WhatsApp</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>PLA, PETG, ABS, Resina & TPU</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Preview 3D Interativo</span>
            </div>
          </div>
        </div>

        {/* METRICAS / DESTAQUE VISUAL */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block">PRECISÃO DA MÁQUINA</span>
              <span className="text-xl font-bold text-white">0.08mm - 0.2mm</span>
            </div>
            <ShieldCheck className="w-8 h-8 text-orange-400 opacity-80" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 block">MATERIAIS DISPONÍVEIS</span>
              <span className="text-xl font-bold text-cyan-400">12+ Cores & Filamentos</span>
            </div>
            <Layers className="w-8 h-8 text-cyan-400 opacity-80" />
          </div>
        </div>

      </div>
    </div>
  );
};
