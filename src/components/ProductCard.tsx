import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { calculateProductBruto, calculateProductFinal, formatWeight } from '../utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onUpdate: (updated: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const { id, name, quantity, unitWeight, addition, deduction, isCustom } = product;

  const bruto = calculateProductBruto(quantity, unitWeight);
  const final = calculateProductFinal(quantity, unitWeight, addition, deduction);

  const handleNumericInput = (
    field: keyof Product,
    value: string
  ) => {
    // Only allow numbers, one comma or period
    const clean = value.replace(/[^0-9.,-]/g, '');
    onUpdate({
      ...product,
      [field]: clean,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 mr-2">
          {isCustom ? (
            <input
              type="text"
              id={`name-input-${id}`}
              value={name}
              onChange={(e) => onUpdate({ ...product, name: e.target.value })}
              placeholder="Nome do produto"
              className="font-display font-semibold text-lg text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          ) : (
            <span className="font-display font-bold text-xl tracking-wide text-slate-800 dark:text-slate-100">
              {name}
            </span>
          )}
          {!isCustom && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Padrão
            </span>
          )}
        </div>

        <button
          onClick={() => onDelete(id)}
          id={`btn-delete-${id}`}
          type="button"
          aria-label={`Excluir ${name}`}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Grid of Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quantidade */}
        <div>
          <label
            htmlFor={`qty-input-${id}`}
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1"
          >
            Quantidade
          </label>
          <div className="relative">
            <input
              type="text"
              id={`qty-input-${id}`}
              inputMode="decimal"
              value={quantity}
              onChange={(e) => handleNumericInput('quantity', e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Peso Unitário */}
        <div>
          <label
            htmlFor={`unit-input-${id}`}
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1"
          >
            Peso Unitário
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id={`unit-input-${id}`}
              inputMode="decimal"
              value={unitWeight}
              onChange={(e) => handleNumericInput('unitWeight', e.target.value)}
              placeholder="0"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-slate-800 dark:text-slate-200"
            />
            <span className="absolute right-3 text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Adicional (+) */}
        <div>
          <label
            htmlFor={`add-input-${id}`}
            className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1"
          >
            Adicional (+)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id={`add-input-${id}`}
              inputMode="decimal"
              value={addition}
              onChange={(e) => handleNumericInput('addition', e.target.value)}
              placeholder="0"
              className="w-full bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 placeholder-emerald-300 dark:placeholder-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <span className="absolute right-3 text-xs font-semibold text-emerald-500/60 dark:text-emerald-400/60 pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Abatimento (-) */}
        <div>
          <label
            htmlFor={`sub-input-${id}`}
            className="block text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1"
          >
            Abatimento (-)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id={`sub-input-${id}`}
              inputMode="decimal"
              value={deduction}
              onChange={(e) => handleNumericInput('deduction', e.target.value)}
              placeholder="0"
              className="w-full bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl pl-3 pr-8 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 placeholder-amber-300 dark:placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <span className="absolute right-3 text-xs font-semibold text-amber-500/60 dark:text-amber-400/60 pointer-events-none">
              kg
            </span>
          </div>
        </div>
      </div>

      {/* Calculations / Output */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-1 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Peso Bruto:</span>
          <span className="font-mono font-medium">{formatWeight(bruto)}</span>
        </div>

        <div className="flex justify-between items-center bg-indigo-50/45 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-950/40 rounded-xl px-3 py-2 mt-1">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            PESO FINAL:
          </span>
          <span className="font-mono font-bold text-sm text-indigo-800 dark:text-indigo-200">
            {formatWeight(final)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
