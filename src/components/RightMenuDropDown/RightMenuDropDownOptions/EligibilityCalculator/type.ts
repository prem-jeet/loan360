interface EligibilityObject {
  monthlyRevenue: number | null;
  rate: number | null;
  tenure: number | null;
  instalments: number | null;
  advInstalments: number | null;
  marginPercent: number | null;
  netAvailableIncome: number | null;
  marginAmount: number | null;
  calculatedLoanAmount: number | null;
  ltvCostValue: number | null;
  ltvPercent: number | null;
  ltvLoanAmount: number | null;
  maxLoanAmount: number | null;
}

export default EligibilityObject;
