export interface State {
  token: Token;
  accessToken: string;
  isAuthenticated: boolean;
  companyModal: boolean;
  allowedCompany: Company[] | [];
  allowedBranch: Branch[] | [];
  allowedFinancialYear: FinancialYear[] | [];
  selectedCompany: Company;
  selectedBranch: Branch;
  selectedFinancialYear: FinancialYear;
  appRole: AppRole[] | [];
}

export interface Token {
  id_token: string;
  expires_in: number;
}

export interface DecodedIdToken {
  at_hash: string;
  aud: string;
  auth_time: number;
  'cognito:username': string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  middle_name: string;
  origin_jti: string;
  phone_number: string;
  phone_number_verified: boolean;
  sub: string;
  token_use: string;
}

export interface Company {
  code: string;
  name: string;
}
export interface Branch {
  code: string;
  name: string;
  inactive: boolean | null;
  inactiveOn: string | null;
  headOffice: boolean | null;
}

export interface FinancialYear {
  id: number;
  companyCode: string;
  name: string;
  fromDate: string;
  toDate: string;
  createdOn: string | null;
  updatedOn: string | null;
  inactive: boolean | null;
  inactiveOn: string | null;
}

export interface AppRole {
  id: number;
  login: string;
  roleCode: string;
}
