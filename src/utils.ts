import { Product } from './types';

export const DEFAULT_PRODUCT_NAMES = ['LCP', 'LCPS', 'LCV', 'LKS', 'LKSP', 'LKSRI'];

export function createDefaultProducts(): Product[] {
  return DEFAULT_PRODUCT_NAMES.map(name => ({
    id: name,
    name,
    quantity: '',
    unitWeight: '1500',
    addition: '',
    deduction: '',
    isCustom: false,
  }));
}

export function calculateProductBruto(quantityStr: string, unitWeightStr: string): number {
  const qty = parseFloat(quantityStr.replace(',', '.')) || 0;
  const unit = parseFloat(unitWeightStr.replace(',', '.')) || 0;
  return qty * unit;
}

export function calculateProductFinal(
  quantityStr: string,
  unitWeightStr: string,
  additionStr: string,
  deductionStr: string
): number {
  const bruto = calculateProductBruto(quantityStr, unitWeightStr);
  const add = parseFloat(additionStr.replace(',', '.')) || 0;
  const ded = parseFloat(deductionStr.replace(',', '.')) || 0;
  return bruto + add - ded;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatWeight(value: number): string {
  return `${formatNumber(value)} kg`;
}
