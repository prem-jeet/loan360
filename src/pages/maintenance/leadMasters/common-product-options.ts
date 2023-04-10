const productOptions = [
  { code: 'UMSME', name: 'Micro,small and medium loan group', loanType: 'U' },

  { code: 'AL', name: 'Auto Loan', loanType: 'S' },

  { code: 'GL', name: 'Gold Loan', loanType: 'S' },

  { code: 'CL', name: 'Corporate', loanType: 'S' },

  { code: 'FWL', name: 'Four Wheeler Loan', loanType: 'S' },

  { code: 'COLS', name: 'Consumer Loan', loanType: 'S' },

  { code: 'COLU', name: 'Consumer Loan', loanType: 'U' },

  { code: 'UCL', name: 'Unsecured Corporate', loanType: 'U' },
  { code: 'HL', name: 'Home Loan', loanType: 'S' },
  { code: 'MOL', name: 'Mortgage Loan', loanType: 'S' },
  { code: 'HOL', name: 'Holiday Loan', loanType: 'U' },
  { code: 'LAP', name: 'Loan Against Property', loanType: 'S' },
  { code: 'SME', name: 'SME', loanType: 'S' },
  { code: 'SMES', name: "SME's", loanType: 'U' },
  { code: 'SME-TL', name: 'SME - Term Loan', loanType: 'S' },
  { code: 'LRD', name: 'Lease Rent Discounting', loanType: 'S' },
  { code: 'TOPUP', name: 'Top-up Loan', loanType: 'U' },
  { code: 'PL', name: 'Personal Loan', loanType: 'U' },
  { code: 'USME', name: 'Un-Secured SME', loanType: 'U' },
  { code: 'EL', name: 'Education Loan', loanType: 'U' },
  { code: 'STL', name: 'Short Term Loan', loanType: 'U' },
  { code: 'QSME', name: 'Quasi Secured SME', loanType: 'Q' },
  { code: 'ML', name: 'Machinery Loan', loanType: 'S' },
  { code: 'LAPOS', name: 'Loan Against Pledging Of Shares', loanType: 'S' },
  { code: 'REF', name: 'Real Estate Finance', loanType: 'S' },
  { code: 'NRPL', name: 'Non- Residential Property Loan', loanType: 'S' },
  { code: 'PROJ', name: 'Project Loan', loanType: 'S' },
  { code: 'BL', name: 'Unsecured Business Loan', loanType: 'U' },
  { code: 'IL', name: 'Instant Loan', loanType: 'U' },
  { code: 'STPL', name: 'Small Ticket Personal Loan', loanType: 'U' },
  { code: 'MFI', name: 'Micro Finance Loan', loanType: 'U' },
  { code: 'LAS', name: 'Loan Against Stock/Book Debts', loanType: 'S' },
  { code: 'LAI', name: 'Loan Against Insurance', loanType: 'S' },
  { code: 'SMSME', name: 'Secured MSME', loanType: 'S' },
  { code: 'SBL', name: ' Secured Business Loan', loanType: 'S' },
  { code: 'WHL', name: ' Warehouse Loan', loanType: 'S' },
  { code: 'SEL', name: 'Education Loan', loanType: 'S' },
  { code: 'SBDS', name: 'Sales Bill Discounting Secured', loanType: 'S' },
  { code: 'SBDU', name: 'Sales Bill Discounting Un-Secured', loanType: 'U' },
  { code: 'SBDQ', name: 'Sales Bill Discounting Quasi-Secured', loanType: 'Q' },
  { code: 'PBDS', name: 'Purchase Bill Discounting Secured', loanType: 'S' },
  { code: 'PBDU', name: 'Purchase Bill Discounting Un-Secured', loanType: 'U' },
  {
    code: 'PBDQ',
    name: 'Purchase Bill Discounting Quasi-Secured',
    loanType: 'Q',
  },
  { code: 'ABDS', name: 'Anchor Bill Discounting Secured', loanType: 'S' },
  { code: 'ABDU', name: 'Anchor Bill Discounting Un-Secured', loanType: 'U' },
  {
    code: 'ABDQ',
    name: 'Anchor Bill Discounting Quasi-Secured',
    loanType: 'Q',
  },
  { code: 'WSS', name: 'Wholesale Small', loanType: 'W' },
  { code: 'WSL', name: 'Wholesale Large', loanType: 'W' },
  { code: 'WSLAP', name: 'Wholesale LAP', loanType: 'W' },
  { code: 'EM', name: 'Equitable Mortgage', loanType: 'U' },
  { code: 'AGRI', name: 'Agriculture Implement', loanType: 'U' },
  { code: 'TRAC', name: 'Tractor Loan', loanType: 'U' },
  { code: 'STRAC', name: 'Tractor Loan Secured', loanType: 'S' },
  { code: 'SWC', name: 'Msme Secured Working Capital', loanType: 'S' },
];

export const commonProductOptions = () => {
  return productOptions;
};
