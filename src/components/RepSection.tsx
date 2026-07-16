import React from 'react';
import { Layers } from 'lucide-react';
import { formatWeight } from '../utils';

interface RepSectionProps {
  quantity: string;
  unitWeight: string;
  onChangeQuantity: (val: string) => void;
  onChangeUnitWeight: (val: string) => void;
}

export const RepSection: React.FC<RepSectionProps> = ({
  quantity,
  unitWeight,
  onChangeQuantity,
  onChangeUnitWeight,
}) => {
  const qtyVal = parseFloat(quantity.replace(',', '.')) || 0;
  const unitVal = parseFloat(unitWeight.replace(',', '.')) || 0;
  const finalWeight = qtyVal * unitVal;

  const handleNumericInput = (
    value: string,
    callback: (val: string) => void
  ) => {
    const clean = value.replace(/[^0-9.,-]/g, '');
    callback(clean);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
          <Layers size={20} />
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 leading-snug">
            Produto Independente (REP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Este produto é calculado à parte e não soma no peso total da produção.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* REP Quantity */}
        <div>
          <label
            htmlFor="rep-qty-input"
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
          >
            Quantidade (REP)
          </label>
          <input
            type="text"
            id="rep-qty-input"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => handleNumericInput(e.target.value, onChangeQuantity)}
            placeholder="0"
            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* REP Unit Weight */}
        <div>
          <label
            htmlFor="rep-unit-input"
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
          >
            Peso Unitário (REP)
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="rep-unit-input"
              inputMode="decimal"
              value={unitWeight}
              onChange={(e) => handleNumericInput(e.target.value, onChangeUnitWeight)}
              placeholder="500"
              className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all text-slate-800 dark:text-slate-200"
            />
            <span className="absolute right-3 text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* REP Calculated Final */}
        <div className="bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/30 dark:border-amber-950/40 rounded-xl px-4 py-2.5 flex flex-col justify-center min-h-[46px]">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            PESO REP FINAL
          </span>
          <span className="font-mono font-bold text-base text-amber-800 dark:text-amber-200 mt-0.5">
            {formatWeight(finalWeight)}
          </span>
        </div>
      </div>
    </div>
  );
};
