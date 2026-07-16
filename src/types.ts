export interface Product {
  id: string;
  name: string;
  quantity: string;      // string for fluid input handling
  unitWeight: string;    // string for fluid input handling
  addition: string;      // string for fluid input handling
  deduction: string;     // string for fluid input handling
  isCustom: boolean;
}

export interface ProductionState {
  products: Product[];
  repQuantity: string;
  repUnitWeight: string;
  observations: string;
  isDark: boolean;
}
