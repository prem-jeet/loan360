export interface EligibilityObject {
  instalments: number | null;
  advInstalments: number | null;
  tenure: number | null;
  ltvCostValue: number | null;
}
export interface ExpensesObject {
  field: string;
  value: number;
}

export interface ExpensesData {
  ExpensesArray: ExpensesObject[];
}
