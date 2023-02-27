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

export interface State {
  token: Token;
  accessToken: string;
  isAuthenticated: boolean;
  allowedCompany: Company[] | [];
  allowedBranch: Branch[] | [];
  selectedCompany: Company;
  selectedBranch: Branch;
}
