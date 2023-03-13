export interface IrrObject {
  amount?: number | null;
  rate?: number | null;
  irr?: number | null;
  inttMonths?: number | null;
  installments?: number | null;
  name?: string | null;
  firstEmi?: string | null;
  nextEmi?: string | null;
  advInstallments?: number | null;
  commission?: number | null;
  charges?: number | null;
  rebate?: number | null;
  security?: number | null;
  agreedAmount?: number | null;
  interest?: number | null;
}
export interface installmentObject {
  amount?: number | null;
  no?: number | null;
  percent?: number | null;
}

export interface installmentData {
  installmentStructure: installmentObject[];
}

export interface addInstallment {
  amount?: number | null;
  no?: number | null;
  percent?: number | null;
}
