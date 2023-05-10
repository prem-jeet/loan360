import {
  Company,
  DecodedIdToken,
  State,
  Token,
  Branch,
  FinancialYear,
} from './userStoreTypes';
import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
import { api } from 'src/boot/axios';

export const useUserStore = defineStore('userStore', {
  state: (): State => ({
    token: { id_token: '', expires_in: 0 },
    appRole: [],
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
    companyModal: false,
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
    },
    setAccessToken(token: string) {
      this.accessToken = token;
    },
    async fetchAllowedCompany(): Promise<Company[] | []> {
      const rsp = await api.get('allowedCompany');

      if (!rsp.data) {
        return [];
      }

      if (rsp.data.length === 1) {
        this.selectedCompany = rsp.data[0];
        await this.fetchAllowedFinancialYear(rsp.data[0]);
      }

      this.allowedCompany = rsp.data;
      return rsp.data;
    },

    async fetchAllowedBranch(): Promise<Branch[] | []> {
      const rsp = await api.get('allowedBranch');

      if (!rsp.data) {
        return [];
      }

      if (rsp.data.length === 1) {
        this.selectedBranch = rsp.data[0];
      }

      this.allowedBranch = rsp.data;
      return rsp.data;
    },
    async fetchAllowedFinancialYear(company: Company) {
      const rsp = await api.get(`company/${company.code}/allowedFinancialYear`);

      if (!rsp.data) {
        return [];
      }

      if (rsp.data.length === 1) {
        this.selectedFinancialYear = rsp.data[0];
      }

      this.allowedFinancialYear = rsp.data;
      return rsp.data;
    },
    async fetchAppRole() {
      const rsp = await api.get('userAppRole/login/jaguar');

      if (!rsp.data) {
        return [];
      }

      this.appRole = rsp.data;
      return rsp.data;
    },
    setAuthHeader(authToken: string) {
      authToken !== ''
        ? (api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`)
        : delete api.defaults.headers.common['Authorization'];
    },
    fetchUser() {
      const authToken = localStorage.getItem('authToken') || ''; // local storage
      const company =
        this.selectedCompany &&
        this.selectedCompany.code &&
        this.selectedBranch &&
        this.selectedBranch.code &&
        this.selectedFinancialYear &&
        this.selectedFinancialYear.companyCode
          ? true
          : false;
      return (this.isAuthenticated =
        (authToken || (this.token && this.token.id_token)) && company
          ? true
          : false);
    },

    saveCompanyDetails(
      selectedCompany: Company,
      selectedBranch: Branch,
      selectedFinancialYear: FinancialYear
    ) {
      this.selectedCompany = selectedCompany;
      this.selectedBranch = selectedBranch;
      this.selectedFinancialYear = selectedFinancialYear;
      localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
      localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));
      localStorage.setItem(
        'selectedFinancialYear',
        JSON.stringify(selectedFinancialYear)
      );
    },

    openCompanySelectModal(value: boolean) {
      return (this.companyModal = value);
    },
  },
});
