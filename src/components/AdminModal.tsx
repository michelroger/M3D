import React, { useState } from 'react';
import type { Product, StoreSettings, ProductCategory } from '../types';
import { hashPassword } from '../services/security';
import { APP_VERSION, APP_BUILD_DATE, CHANGELOG } from '../config/version';
import { X, ShieldLock, Plus, Trash2, Edit3, Save, Download, Upload, Lock, Phone, Store, Key, GitCommit, CheckCircle2, History } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'sync' | 'changelog'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [whatsappNumber, setWhatsappNumber] = useState<string>(settings.whatsappNumber);
  const [storeName, setStoreName] = useState<string>(settings.storeName);
  const [newPin, setNewPin] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    const inputHash = await hashPassword(pinInput, settings.adminSalt);
    if (inputHash === settings.adminPinHash || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinInput('');
    } else {
      setPinError('PIN ou Senha incorreta. Tente novamente.');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;

    if (editingProduct.id) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p
      );
      onSaveProducts(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: editingProduct.title || 'Nova Peça 3D',
        description: editingProduct.description || '',
        category: editingProduct.category || 'functional',
        basePrice: editingProduct.basePrice || 50.0,
        dimensions: editingProduct.dimensions || { x: 100, y: 100, z: 100 },
        weightGrams: editingProduct.weightGrams || 100,
        printTimeHours: editingProduct.printTimeHours || 4,
        availableMaterials: editingProduct.availableMaterials || ['PLA', 'PETG'],
        availableColors: editingProduct.availableColors || [
          { name: 'Preto', hex: '#121212' },
          { name: 'Laranja', hex: '#FF5500' },
        ],
        imageUrl:
          editingProduct.imageUrl ||
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        featured: editingProduct.featured || false,
        inStock: editingProduct.inStock !== false,
        tags: editingProduct.tags || ['3D', 'Print'],
      };
      onSaveProducts([newProd, ...products]);
    }

    setEditingProduct(null);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta peça do catálogo?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedHash = settings.adminPinHash;

    if (newPin && newPin.length >= 4) {
      updatedHash = await hashPassword(newPin, settings.adminSalt);
    }

    const updatedSettings: StoreSettings = {
      ...settings,
      whatsappNumber,
      storeName,
      adminPinHash: updatedHash,
    };

    onSaveSettings(updatedSettings);
    setSaveMessage('Configurações salvas com sucesso!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onSaveProducts(parsed);
            alert('Catálogo importado com sucesso!');
          }
        } catch (err) {
          alert('Arquivo JSON inválido.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldLock className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white">Painel Administrativo Mr3D</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Acesso Restrito ao Maker</h3>
              <p className="text-xs text-slate-400 mt-1">
                Digite o PIN ou senha de administrador (PIN padrão: <code className="text-orange-400 font-mono">1234</code>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Digite a senha..."
                className="w-full bg-slate-950 text-white text-center text-base rounded-xl px-4 py-3 border border-slate-800 focus:border-orange-500 focus:outline-none tracking-widest font-mono"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-400">{pinError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all"
              >
                Entrar no Painel Admin
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Catálogo ({products.length})
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Configurações da Loja
              </button>

              <button
                onClick={() => setActiveTab('sync')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'sync'
                    ? 'border-orange-500 text-orange-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Exportar / GitHub Sync
              </button>

              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'changelog'
                    ? 'border-cyan-500 text-cyan-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Versões & CI/CD</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white font-mono">GERENCIAMENTO DE PRODUTOS</h3>
                    <button
                      onClick={() =>
                        setEditingProduct({
                          title: '',
                          description: '',
                          category: 'functional',
                          basePrice: 50,
                          dimensions: { x: 100, y: 100, z: 100 },
                          weightGrams: 100,
                          printTimeHours: 4,
                          availableMaterials: ['PLA', 'PETG'],
                          availableColors: [
                            { name: 'Preto', hex: '#121212' },
                            { name: 'Laranja', hex: '#FF5500' },
                          ],
                          imageUrl: '',
                          inStock: true,
                        })
                      }
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Peça 3D</span>
                    </button>
                  </div>

                  {editingProduct && (
                    <form onSubmit={handleSaveProduct} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-orange-400 font-mono">
                        {editingProduct.id ? 'EDITAR PEÇA 3D' : 'CADASTRAR NOVA PEÇA 3D'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Título do Produto:</label>
                          <input
                            type="text"
                            required
                            value={editingProduct.title || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Categoria:</label>
                          <select
                            value={editingProduct.category || 'functional'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          >
                            <option value="functional">Peças Úteis</option>
                            <option value="decor">Decoração</option>
                            <option value="geek">Geek & Action</option>
                            <option value="cosplay">Cosplay & Props</option>
                            <option value="organizer">Organizadores</option>
                            <option value="mechanical">Mecânica</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Preço Base Inicial (R$):</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={editingProduct.basePrice || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">URL da Imagem / Foto:</label>
                          <input
                            type="text"
                            value={editingProduct.imageUrl || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 mb-1">Descrição Detalhada:</label>
                          <textarea
                            rows={2}
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Peça</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{p.title}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Cat: {p.category} • Preço: R$ {p.basePrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {activeTab === 'settings' && (
                <form onSubmit={handleSaveStoreSettings} className="max-w-md space-y-4 text-xs">
                  <h3 className="text-sm font-bold text-white font-mono mb-4">CONFIGURAÇÕES GERAIS DA LOJA</h3>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Número do WhatsApp para Orçamentos (com DDD e Código do País):
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="5511999999999"
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-orange-400" />
                      Nome Comercial da Marca / Maker:
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      Alterar PIN / Senha do Admin (Mínimo 4 digitos):
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Deixe em branco se não quiser alterar..."
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {saveMessage && <p className="text-emerald-400 text-xs font-semibold">{saveMessage}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Salvar Configurações
                  </button>
                </form>
              )}

              {activeTab === 'sync' && (
                <div className="space-y-6 text-xs text-slate-300">
                  <h3 className="text-sm font-bold text-white font-mono">EXPORTAR & DEPLOY NO GITHUB PAGES</h3>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                      <Download className="w-4 h-4" />
                      1. Exportar Catálogo JSON (`catalog.json`)
                    </h4>
                    <p className="text-slate-400">
                      Baixe o arquivo de catálogo atualizado com todas as alterações para substituir na pasta <code className="text-cyan-400">src/data/catalog.json</code> antes de dar git commit.
                    </p>
                    <button
                      onClick={handleExportJSON}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold flex items-center gap-2 hover:bg-slate-800"
                    >
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>Baixar `catalog.json`</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      2. Importar Backup JSON
                    </h4>
                    <p className="text-slate-400">
                      Restaure ou carregue um catálogo salvo anteriormente.
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: CONTROLE DE VERSÃO E CHANGELOG */}
              {activeTab === 'changelog' && (
                <div className="space-y-6 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono">CONTROLE DE VERSÃO & AUTOMATION CI/CD</h3>
                      <p className="text-[11px] text-slate-400">Status atual da versão e esteira de publicação automática</p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold">
                      v{APP_VERSION} ({APP_BUILD_DATE})
                    </div>
                  </div>

                  {/* CARD STATUS CI/CD GITHUB ACTIONS */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Pipeline de Publicação Automática (CI/CD GitHub Actions)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ATIVO
                      </span>
                    </div>

                    <p className="text-slate-400 leading-relaxed">
                      O arquivo <code className="text-cyan-400">.github/workflows/deploy.yml</code> está ativo. A cada commit realizado na branch <code className="text-orange-400">main</code>, o GitHub compila e publica o site automaticamente no GitHub Pages!
                    </p>
                  </div>

                  {/* REGISTRO DE VERSÕES (CHANGELOG) */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <GitCommit className="w-4 h-4 text-orange-400" />
                      Histórico de Versões e Melhorias
                    </h4>

                    {CHANGELOG.map((item) => (
                      <div key={item.version} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-orange-400 font-bold text-sm">v{item.version} • {item.title}</span>
                          <span className="text-slate-500 text-[10px]">{item.date}</span>
                        </div>

                        <ul className="space-y-1.5 pt-1 text-slate-300">
                          {item.changes.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 font-mono">•</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
