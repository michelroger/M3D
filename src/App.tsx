import React, { useState, useMemo } from 'react';
import type { Product, StoreSettings } from './types';
import defaultCatalog from './data/catalog.json';
import { encryptData, decryptData } from './services/security';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminModal } from './components/AdminModal';
import { CostCalculator } from './components/CostCalculator';
import { Footer } from './components/Footer';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'm3d_catalog_products';
const STORAGE_KEY_SETTINGS = 'm3d_store_settings';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedEncrypted = localStorage.getItem(STORAGE_KEY_PRODUCTS) || localStorage.getItem('mr3d_catalog_products');
      if (savedEncrypted) {
        const decrypted = decryptData<Product[]>(savedEncrypted);
        if (decrypted && Array.isArray(decrypted) && decrypted.length > 0) {
          // As edições e criações do usuário no LocalStorage têm PRIORIDADE MÁXIMA
          const userMap = new Map<string, Product>();
          decrypted.forEach((p) => {
            if (p && p.id) userMap.set(p.id, p);
          });

          // Adicionar itens padrão do catalog.json apenas se o usuário ainda não tiver mexido neles
          (defaultCatalog as Product[]).forEach((defProd) => {
            if (!userMap.has(defProd.id)) {
              userMap.set(defProd.id, defProd);
            }
          });

          return Array.from(userMap.values());
        }
      }
    } catch (err) {
      console.warn('Usando catálogo inicial padrão.');
    }
    return defaultCatalog as Product[];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const defaultSettings: StoreSettings = {
      whatsappNumber: '5511999999999',
      storeName: 'M3D Maker Studio',
      customMessageTemplate: '',
      adminPinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
      adminSalt: 'M3D_SALT_2026',
      currencySymbol: 'R$',
      customMaterials: [
        { id: 'pla', name: 'PLA', priceMultiplier: 1.0 },
        { id: 'petg', name: 'PETG', priceMultiplier: 1.15 },
        { id: 'abs', name: 'ABS', priceMultiplier: 1.1 },
        { id: 'tpu', name: 'TPU', priceMultiplier: 1.3 },
        { id: 'resina', name: 'Resina', priceMultiplier: 1.4 },
      ],
    };

    try {
      const savedEncrypted = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem('mr3d_store_settings');
      if (savedEncrypted) {
        const decrypted = decryptData<StoreSettings>(savedEncrypted);
        if (decrypted && decrypted.storeName) {
          return {
            ...defaultSettings,
            ...decrypted,
            customMaterials: decrypted.customMaterials || defaultSettings.customMaterials,
          };
        }
      }
    } catch (err) {
      console.warn('Usando configurações padrão da loja.');
    }
    return defaultSettings;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title'>('featured');

  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isCostCalcOpen, setIsCostCalcOpen] = useState<boolean>(false);

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    const encrypted = encryptData(newProducts);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, encrypted);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    const encrypted = encryptData(newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, encrypted);
  };

  const handleApplyPriceToProduct = (productId: string, price: number) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, basePrice: price } : p));
    handleSaveProducts(updated);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = product.title.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTags) return false;
        }

        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        if (selectedMaterial !== 'all') {
          const hasMaterial = product.availableMaterials.some(
            (m) => m.toLowerCase() === selectedMaterial.toLowerCase()
          );
          if (!hasMaterial) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedMaterial, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <HeroBanner />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedMaterial={selectedMaterial}
          onSelectMaterial={setSelectedMaterial}
          materials={settings.customMaterials}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setSelectedProductModal(prod)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 my-8">
            <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Nenhum modelo 3D encontrado</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tente ajustar os filtros por categoria ou alterar o termo de busca.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedMaterial('all');
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all"
            >
              Resetar Filtros
            </button>
          </div>
        )}
      </main>

      <Footer settings={settings} onOpenAdmin={() => setIsAdminOpen(true)} />

      <ProductModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        settings={settings}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={handleSaveProducts}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onOpenCostCalc={() => setIsCostCalcOpen(true)}
      />

      <CostCalculator
        isOpen={isCostCalcOpen}
        onClose={() => setIsCostCalcOpen(false)}
        products={products}
        onApplyPriceToProduct={handleApplyPriceToProduct}
      />
    </div>
  );
};

export default App;
