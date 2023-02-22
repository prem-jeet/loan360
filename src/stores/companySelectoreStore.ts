import {
  fetchAllowedBranch,
  fetchAllowedCompany,
  fetchAllowedFinancialYear,
  allowedCompanyType,
  allowedBranchType,
  allowedFinencialYearType,
} from 'src/utils/testData/companySelector';

import { defineStore } from 'pinia';

type state = {
  company: allowedCompanyType[] | [];
  branch: allowedBranchType[] | [];
  financialYear: allowedFinencialYearType[] | [];
  selectedCompany: allowedCompanyType | null;
  selectedBranch: allowedBranchType | null;
  selectedFfinancialYear: allowedFinencialYearType | null;
};

export const useCompanySelectorStore = defineStore('companySelectorStore', {
  state: (): state => ({
    company: [],
    branch: [],
    financialYear: [],
    selectedCompany: null,
    selectedBranch: null,
    selectedFfinancialYear: null,
  }),
  getters: {},
  actions: {
    async fetchCompany(): Promise<allowedCompanyType[]> {
      const rsp = await fetchAllowedCompany();
      return rsp;
    },
    async fetchBranch(): Promise<allowedBranchType[]> {
      const rsp = await fetchAllowedBranch();
      return rsp;
    },
    async fetchFinancialYear(code: string) {
      const rsp = await fetchAllowedFinancialYear(code);
      this.financialYear = rsp;
    },

    async fetchData() {
      const [company, branch] = await Promise.all([
        this.fetchCompany(),
        this.fetchBranch(),
      ]);
      this.company = company;
      this.branch = branch;
    },

    setSelectedData(
      data: {
        selectedCompany: allowedCompanyType;
        selectedBranch: allowedBranchType;
        selectedFinancialYear: allowedFinencialYearType;
      },
      callback: () => void
    ) {
      this.selectedCompany = data.selectedCompany;
      this.selectedBranch = data.selectedBranch;
      this.selectedFfinancialYear = data.selectedFinancialYear;
      callback();
    },
  },
});
