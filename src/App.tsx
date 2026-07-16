import { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  RotateCcw, 
  RefreshCw, 
  Clipboard, 
  Check, 
  Sun, 
  Moon, 
  AlertTriangle,
  FileText,
  Trash2,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { Product } from './types';
import { 
  createDefaultProducts, 
  calculateProductFinal, 
  formatWeight 
} from './utils';
import { ProductCard } from './components/ProductCard';
import { RepSection } from './components/RepSection';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Theme Management (Defaults to Dark)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // State Management with persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cal_products');
    return saved ? JSON.parse(saved) : createDefaultProducts();
  });

  const [repQuantity, setRepQuantity] = useState<string>(() => {
    return localStorage.getItem('cal_rep_qty') || '';
  });

  const [repUnitWeight, setRepUnitWeight] = useState<string>(() => {
    return localStorage.getItem('cal_rep_unit') || '500';
  });

  const [observations, setObservations] = useState<string>(() => {
    return localStorage.getItem('cal_obs') || '';
  });

  // Interactive UI States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist values in localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('cal_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cal_rep_qty', repQuantity);
  }, [repQuantity]);

  useEffect(() => {
    localStorage.setItem('cal_rep_unit', repUnitWeight);
  }, [repUnitWeight]);

  useEffect(() => {
    localStorage.setItem('cal_obs', observations);
  }, [observations]);

  // Helper trigger for toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Add a new custom product
  const handleAddProduct = () => {
    const customCount = products.filter(p => p.isCustom).length + 1;
    const newProduct: Product = {
      id: `custom_${Date.now()}`,
      name: `Adicional ${customCount}`,
      quantity: '',
      unitWeight: '1500',
      addition: '',
      deduction: '',
      isCustom: true,
    };
    setProducts(prev => [...prev, newProduct]);
    triggerToast('Produto adicional adicionado!');
  };

  // Delete a product
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    triggerToast('Produto removido!');
  };

  // Update product fields
  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Restore Default products without duplicating
  const handleRestoreDefaults = () => {
    const defaultList = createDefaultProducts();
    const existingIdsOrNames = new Set(products.map(p => p.name));

    const toRestore = defaultList.filter(def => !existingIdsOrNames.has(def.name));

    if (toRestore.length === 0) {
      triggerToast('Todos os produtos padrão já estão presentes!');
      return;
    }

    setProducts(prev => [...prev, ...toRestore]);
    triggerToast(`${toRestore.length} produto(s) padrão restaurado(s)!`);
  };

  // Reset quantity fields only (Zerar Quantidades)
  const handleClearQuantities = () => {
    // reset products properties but keep unitWeight and custom list
    setProducts(prev => prev.map(p => ({
      ...p,
      quantity: '',
      addition: '',
      deduction: '',
    })));

    setRepQuantity('');
    setObservations('');
    setIsConfirmOpen(false);
    triggerToast('Quantidades e observações zeradas!');
  };

  // Calculate Overall Peso Total (excludes REP)
  const totalWeight = products.reduce((sum, p) => {
    return sum + calculateProductFinal(p.quantity, p.unitWeight, p.addition, p.deduction);
  }, 0);

  // Generate formatted text report
  const compileReport = () => {
    const lines: string[] = ['📦 RESUMO DE PRODUÇÃO', ''];

    // Main section products with weight > 0
    let count = 0;
    products.forEach(p => {
      const finalWeight = calculateProductFinal(p.quantity, p.unitWeight, p.addition, p.deduction);
      if (finalWeight > 0) {
        lines.push(`${p.name} -> Peso: ${formatWeight(finalWeight)}`, '');
        count++;
      }
    });

    // Main Total
    lines.push(`PESO TOTAL: ${formatWeight(totalWeight)}`, '');

    // Independent REP with weight > 0
    const repQtyVal = parseFloat(repQuantity.replace(',', '.')) || 0;
    const repUnitVal = parseFloat(repUnitWeight.replace(',', '.')) || 0;
    const repWeight = repQtyVal * repUnitVal;
    if (repWeight > 0) {
      lines.push(`REP -> Peso: ${formatWeight(repWeight)}`, '');
    }

    // Observations
    const cleanObs = observations.trim();
    if (cleanObs) {
      lines.push('OBSERVAÇÕES:', '', cleanObs);
    }

    return lines.join('\n').trim();
  };

  // Copy report to clipboard
  const handleCopyReport = async () => {
    const report = compileReport();
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      triggerToast('Relatório copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = report;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        triggerToast('Relatório copiado para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        triggerToast('Erro ao copiar. Selecione o texto abaixo e copie manualmente.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20">
      
      {/* HEADER */}
      <header className="border-b border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center">
              <Calculator size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Calculadora de Produtos
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Fechamento de produção ágil e simplificado
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            id="theme-toggle"
            type="button"
            aria-label="Alternar tema"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-8 pb-32">
        
        {/* ACTION TOOLBAR */}
        <section className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAddProduct}
              id="btn-add-product"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-indigo-600/15 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              Adicionar Produto
            </button>
            
            <button
              onClick={handleRestoreDefaults}
              id="btn-restore-defaults"
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Restaurar Produtos Padrão
            </button>
          </div>

          <button
            onClick={() => setIsConfirmOpen(true)}
            id="btn-clear-quantities"
            className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-sm px-4 py-2.5 rounded-2xl transition-all cursor-pointer ml-auto sm:ml-0"
          >
            <RefreshCw size={16} />
            Zerar Quantidades
          </button>
        </section>

        {/* MAIN PRODUCTS SECTION */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Produtos Principais e Adicionais
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {products.length} cadastrado(s)
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 bg-white/30 dark:bg-slate-900/10"
              >
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400">
                  <PlusCircle size={28} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-700 dark:text-slate-300">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
                    Clique em "Restaurar Produtos Padrão" para recarregar a lista fixa ou "Adicionar Produto" para criar um novo.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onUpdate={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* INDEPENDENT REP SECTION */}
        <section>
          <RepSection
            quantity={repQuantity}
            unitWeight={repUnitWeight}
            onChangeQuantity={setRepQuantity}
            onChangeUnitWeight={setRepUnitWeight}
          />
        </section>

        {/* OBSERVATIONS */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <FileText size={18} />
            <h2 className="font-display font-bold text-base">
              Observações do dia
            </h2>
          </div>
          <textarea
            id="observations-textarea"
            rows={4}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Digite aqui observações importantes sobre a produção (paradas de máquinas, atrasos, etc.)..."
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-slate-800 dark:text-slate-200 resize-none leading-relaxed"
          />
        </section>

        {/* VISUAL REPORT PREVIEW */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Pré-visualização do Relatório
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              Formato Pronto para Envio
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-900 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
            {compileReport()}
          </div>
        </section>

      </main>

      {/* FOOTER TOTALS & CALL TO ACTION (STICKY) */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-4 z-45">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 text-slate-900 dark:text-white">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              PESO TOTAL:
            </span>
            <span className="font-mono font-black text-2xl tracking-tight text-indigo-600 dark:text-indigo-400">
              {formatWeight(totalWeight)}
            </span>
          </div>

          <button
            onClick={handleCopyReport}
            id="btn-copy-report"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check size={16} className="animate-bounce" />
                Copiado!
              </>
            ) : (
              <>
                <Clipboard size={16} />
                Copiar relatório
              </>
            )}
          </button>
        </div>
      </footer>

      {/* CONFIRM CLEAR DIALOG */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex items-center gap-3 text-rose-500 dark:text-rose-400 mb-3">
                <AlertTriangle size={24} />
                <h3 className="font-display font-black text-xl">Confirmar Limpeza</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                Tem certeza que deseja zerar todas as quantidades e observações? Os produtos atuais e seus pesos unitários serão mantidos.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearQuantities}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-colors cursor-pointer"
                >
                  Sim, Zerar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING NOTIFICATION (TOAST) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 pointer-events-none">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-800 dark:border-slate-200 rounded-2xl px-4 py-3 shadow-xl text-xs font-semibold text-center flex items-center justify-center gap-2 pointer-events-auto"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
