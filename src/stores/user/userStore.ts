import { Company, DecodedIdToken, State, Token } from './userStoreTypes';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('userStore', {
  state: (): State => ({
    token: { id_token: '', expires_in: 0 },
    accessToken: '',
    isAuthenticated: false,
    allowedCompany: [],
    allowedBranch: [],
    allowedFinancialYear: [],
    selectedCompany: { code: '', name: '' },
    selectedBranch: {
      code: '',
      name: '',
      inactive: null,
      headOffice: null,
      inactiveOn: null,
    },
    selectedFinancialYear: {
      id: 0,
      companyCode: '',
      name: '',
      fromDate: '',
      toDate: '',
      createdOn: null,
      updatedOn: null,
      inactive: null,
      inactiveOn: null,
    },
  }),
  getters: {
    idToken: (state): string => state.token.id_token,
    expiresIn: (state): number => state.token.expires_in,
    decodedIdToken: (state): DecodedIdToken => {
      if (state.token.id_token) {
        return jwt_decode(state.token.id_token);
      }
      return {} as DecodedIdToken;
    },

    name(): string {
      return this.decodedIdToken['cognito:username'];
    },
    email(): string {
      return this.decodedIdToken.email;
    },
    phoneNo(): string {
      return this.decodedIdToken.phone_number;
    },
  },
  actions: {
    setToken(token: Token) {
      this.token = token;
      this.isAuthenticated = true;

      localStorage.setItem('jaguar', JSON.stringify(token));
    },
    setAccessToken(token: string) {
      this.accessToken = token;
    },
    async fetchAllowedCompany(): Promise<Company[] | []> {
      const rsp = await api.get('allowedCompany', {
        headers: { Authorization: `Bearer ${this.idToken}` },
      });

      if (!rsp.data) {
        return [];
      }
      console.log(rsp);

      return rsp.data;
    },
    async fetchAllowedFinancialYear(company: Company) {
      const rsp = await api.get(`company/${company.code}/allowedFinancialYear`);

      if (rsp.data) {
        this.allowedFinancialYear = rsp.data;
      }
    },
  },
});
