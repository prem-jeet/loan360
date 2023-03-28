export interface EligibilityObject {
  ltvCostValue: number | null;
}
export interface ExpensesObject {
  field: string;
  value: number;
}

export interface ExpensesData {
  ExpensesArray: ExpensesObject[];
}
