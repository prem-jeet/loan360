<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col q-px-xl">
        <q-card>
          <q-form @submit="submit" @reset="resetSelection" class="q-gutter-md">
            <q-card-section class="bg-grey-4 text-center">
              <span class="text-h4 my-div">Deposit Summary</span>
            </q-card-section>
            <q-card-section class="">
              <div class="row justify-center q-pb-lg">
                <div class="col-sm-6 col-md-4 col-12 q-pa-lg">
                  <SearchableMultiselect
                    :max-chips="4"
                    chip-key="value"
                    label="Companies"
                    v-model="depositFormData.selectedCompanies"
                    :options="companyOptions"
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-12 q-pa-lg">
                  <SearchableMultiselect
                    :max-chips="4"
                    chip-key="value"
                    label="Branches"
                    v-model="depositFormData.selectedBranches"
                    :options="BranchOptions"
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-12 q-pa-lg">
                  <SearchableMultiselect
                    :max-chips="4"
                    chip-key="value"
                    label="Product"
                    v-model="depositFormData.product"
                    :options="productItems"
                  />
                </div>
                <!-- </div> -->
                <!-- <div class="row justify-center q-py-lg"> -->
                <div class="col-sm-6 col-md-4 col-12 q-pa-lg">
                  <SearchableMultiselect
                    :max-chips="4"
                    chip-key="value"
                    label="Category"
                    v-model="depositFormData.category"
                    :options="categoryItems"
                  />
                </div>
                <div
                  class="col-4 col-sm-4 col-12 q-pa-lg justify-center text-center"
                >
                  <q-field
                    color="primary"
                    label="Deposit From - To Date:"
                    stack-label
                  >
                    <template v-slot:prepend>
                      <q-btn icon="event" round color="primary"></q-btn>
                    </template>
                    <template v-slot:control>
                      <div
                        class="self-center full-width no-outline"
                        tabindex="0"
                      >
                        <span
                          v-if="
                            depositFormData.dateRange.from &&
                            depositFormData.dateRange.to
                          "
                        >
                          From Date:
                          {{ depositFormData.dateRange.from }}
                          To Date:
                          {{ depositFormData.dateRange.to }}
                        </span>
                      </div>
                    </template>
                  </q-field>

                  <q-popup-proxy
                    @before-show="updateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="depositFormData.dateRange"
                      landscape
                      range
                      title="Select a date range"
                    >
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Cancel"
                          color="primary"
                          flat
                          v-close-popup
                        />
                        <q-btn
                          label="OK"
                          color="primary"
                          flat
                          @click="updateProxy"
                          v-close-popup
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </div>
                <div class="col-sm-4 col-12 q-pa-lg">
                  <q-toggle
                    v-model="depositFormData.showIntAndPrinciple"
                    checked-icon="check"
                    color="blue"
                    unchecked-icon="clear"
                    label="Show Principle & Interest"
                  />
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-sm-6 col-md-4 col-12 q-px-lg q-gutter-sm">
                  <q-radio
                    v-model="depositFormData.documentType"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="pdf"
                    label="View as PDF"
                  />
                  <q-radio
                    v-model="depositFormData.documentType"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="xls"
                    label="View as Excel-Sheet"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator inset />
            <q-card-actions align="center" class="q-py-sm">
              <q-btn
                color="primary"
                label="submit"
                :disable="
                  !(
                    depositFormData.selectedBranches.length &&
                    depositFormData.selectedCompanies.length
                  )
                "
                :loading="loading"
                type="submit"
              />
              <q-btn color="red-10" label="Reset" type="reset" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user/userStore';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, reactive, computed } from 'vue';
import { onFailure, onSuccess, confirmDialog } from 'src/utils/notification';
import SearchableMultiselect from 'src/components/SearchableMultiselect.vue';
import { date } from 'quasar';

const userStore = useUserStore();
const { allowedCompany, allowedBranch } = storeToRefs(userStore);

const breadcrumbs = [
  { path: '/module/td', label: 'Term Deposits' },
  { path: '/module/td/reports', label: 'Reports' },
  {
    path: '/module/td/depositReports/depositSummary',
    label: 'Deposit Summary',
  },
];

// type Option = { label: string; value: string };

const depositFormData = reactive({
  selectedCompanies: [],
  selectedBranches: [],
  product: [],
  category: [],
  dateRange: { from: '2022-04-01', to: '2023-03-31' },
  showIntAndPrinciple: false,
  documentType: 'pdf',
});

const productItems = [
  { value: 'FD', label: 'Fixed Deposit' },
  { value: 'RD', label: 'Recurring Deposit' },
  { value: 'DD', label: 'Daily Deposit' },
  { value: 'DB', label: 'Debenture' },
  { value: 'SB', label: 'Sub-ordinate Debentures' },
  { value: 'FC', label: 'Fully Convertible Debentures' },
];
const categoryItems = [
  { value: 'S', label: 'Share Holders' },
  { value: 'D', label: 'Directors' },
  { value: 'O', label: 'Others' },
  { value: 'DR', label: "Director's Relatives" },
];

const companyOptions = computed(() =>
  allowedCompany.value.map((company) => ({
    label: company.name,
    value: company.code,
  }))
);

const BranchOptions = computed(() =>
  allowedBranch.value.map((branch) => ({
    label: branch.name,
    value: branch.code,
  }))
);

const proxyDate = ref({ from: '2022-04-01', to: '2023-03-31' });
const loading = ref(false);

const updateProxy = () => {
  proxyDate.value = depositFormData.dateRange;
};

const resetSelection = () => {
  depositFormData.selectedCompanies = [];
  depositFormData.selectedBranches = [];
  depositFormData.product = [];
  depositFormData.category = [];
  depositFormData.dateRange = { from: '2022-04-01', to: '2023-03-31' };
  depositFormData.showIntAndPrinciple = false;
  depositFormData.documentType = 'pdf';
};

const dateFormat = (dateString: string, type: number) => {
  // if type === 1 return YYYY-MM-DD format
  // else return DD MMM YYYY format
  return type === 1
    ? date.formatDate(dateString, 'YYYY-MM-DD')
    : date.formatDate(dateString, 'DD MMM YYYY');
};

const SelectedDataFormat = (
  item: Array<{ value: number; label: string }>,
  type: number
) => {
  // type == 1 return "Code" of the Array
  // type == 2 return "Name" of the Array
  // type == 3 return only "Name" of ZEROTH-index as per requirement of the Array
  if (item.length > 0) {
    if (type === 1) {
      return item.map((element) => `'${element.value}'`);
    } else if (type === 2) {
      return item.map((element) => element.label);
    } else if (type === 3) {
      return item[0].label;
    }
  } else {
    return "''";
  }
};

const submit = async () => {
  loading.value = false; // Need to make it true, once API issue resolve
  // Adding a temp variable for Adding random Report name creation.
  let temp = new Date();

  let payload = {
    exportType: depositFormData.documentType,
    companyName: SelectedDataFormat(depositFormData.selectedCompanies, 3),
    branchName: SelectedDataFormat(depositFormData.selectedBranches, 3),
    pageOrientation: 'Portrait',
    pageType: 'A4',
    query:
      "Select 'Fresh Deposit' as Desciption, Count(id) as nCount, Sum(Deposit_Amount) as Amount from DEPOSIT where " +
      "Deposit_date>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and Deposit_date<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      "mode<>'Renewed' and company_code in (" +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') group by Desciption ' +
      ' union all ' +
      "Select 'Renewed Deposit' as Desciption, Count(id) as nCount, Sum(Deposit_Amount) as Amount from DEPOSIT where " +
      "Deposit_date>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and Deposit_date<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      "mode='Renewed' and company_code in (" +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') group by Desciption ' +
      ' union all ' +
      "Select 'Loan Given' as Desciption, Count(distinct Deposit_id) as nCount, Sum(id.loan_dr) as Amount from INTEREST_DEPOSIT id left join Deposit d on d.id = id.deposit_id where " +
      "id.Date>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and id.date<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      ' id.company_code in (' +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and id.branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and d.product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and d.category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') and id.loan_dr<>0 group by Desciption ' +
      ' union all ' +
      "Select 'Loan Refund' as Desciption, Count(distinct Deposit_id) as nCount, Sum(loan_cr) as Amount from INTEREST_DEPOSIT id left join Deposit d on d.id = id.deposit_id where " +
      "id.Date>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and id.date<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      'id.company_code in (' +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and id.branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and d.product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and d.category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') and id.loan_cr<>0 group by Desciption ' +
      ' union all ' +
      "Select 'Matured Not Repaid' as Desciption, Count(id) as nCount, Sum(Deposit_Amount) as Amount from DEPOSIT where " +
      "Maturity_Date<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and (Repaid_on is NULL or Repaid_on>'" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "') " +
      'and company_code in (' +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') group by Desciption ' +
      ' union all ' +
      "Select 'Matured & Repaid' as Desciption, Count(id) as nCount, Sum(Deposit_Amount) as Amount from DEPOSIT where " +
      "Repaid_on>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and Repaid_on<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      'Maturity_Date<= Repaid_on and company_code in (' +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') group by Desciption ' +
      ' union all ' +
      "Select 'Pre-Mature Deposits' as Desciption, Count(id) as nCount, Sum(Deposit_Amount) as Amount from DEPOSIT where " +
      "Repaid_on>='" +
      dateFormat(depositFormData.dateRange.from, 1) +
      "' and Repaid_on<='" +
      dateFormat(depositFormData.dateRange.to, 1) +
      "' and " +
      'Maturity_Date>Repaid_on and company_code in (' +
      SelectedDataFormat(depositFormData.selectedCompanies, 1) +
      ') and branch_code in (' +
      SelectedDataFormat(depositFormData.selectedBranches, 1) +
      ')' +
      ' and product in (' +
      SelectedDataFormat(depositFormData.product, 1) +
      ') and category in (' +
      SelectedDataFormat(depositFormData.category, 1) +
      ') group by Desciption ',
    reportName: 'depositSummary' + '_' + temp.getTime(),
    title: 'Deposit Summary',
    description:
      'From Date: ' +
      dateFormat(depositFormData.dateRange.from, 2) +
      ' To Date: ' +
      dateFormat(depositFormData.dateRange.to, 2),
    reportFieldsDTO: [
      {
        caption: 'Description',
        fieldName: 'Desciption',
        dataType: 'string',
        width: 35,
      },
      {
        caption: 'Count',
        fieldName: 'nCount',
        dataType: 'bigDecimal',
        width: 15,
      },
      {
        caption: 'Amount',
        fieldName: 'Amount',
        dataType: 'bigDecimal',
        width: 15,
      },
    ],
  };

  const rsp = await api.post('flexibleReport', payload);

  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      position: 'center',
    });
  } else {
    onFailure({
      msg: 'API Request rejected',
      position: 'center',
    });
  }
  loading.value = false;
};
</script>

<style scoped></style>
