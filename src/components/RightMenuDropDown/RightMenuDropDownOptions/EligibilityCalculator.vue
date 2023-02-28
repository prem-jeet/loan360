<template>
  <q-card class="e-card" flat bordered>
    <q-item class="bg-light-blue-5 text-white q-pa-none q-ma-none">
      <q-item-section>
        <q-toolbar class="q-pa-none q-ma-none bg-purple-6">
          <p class="text-weight-medium q-pt-md q-px-md">
            Eligibility Calculator
          </p>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-item-section>
    </q-item>
    <q-separator />

    <q-card-section style="max-height: 85vh" class="scroll">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
          <q-radio
            v-model="radio"
            val="bs"
            label="Business LoanSalaried Loan
"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 q-px-sm">
          <q-radio v-model="radio" val="salary" label="Salaried Loan" />
        </div>
      </div>
      <p></p>
      <BusinessEligibilityForm
        :EligibilitymodalObj="EligibilitymodalObj"
        v-if="radio == 'bs'"
      />
      <SalaryEligibilityForm
        :EligibilitymodalObj="EligibilitymodalObj"
        v-if="radio == 'salary'"
      />
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import BusinessEligibilityForm from 'src/components/RightMenuDropDown/RightMenuDropDownOptions/BusinessEligibilityForm.vue';
import SalaryEligibilityForm from 'src/components/RightMenuDropDown/RightMenuDropDownOptions/SalaryEligibilityForm.vue';
import { ref, reactive } from 'vue';
const radio = ref('bs');
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
  [key: string]: number | null;
}

const EligibilitymodalObj = reactive<EligibilityObject>({
  instalments: null,
  advInstalments: null,
  monthlyRevenue: null,
  marginPercent: null,
  netAvailableIncome: null,
  tenure: null,
  rate: null,
  calculatedLoanAmount: null,
  ltvCostValue: null,
  ltvPercent: null,
  ltvLoanAmount: null,
  marginAmount: null,
  maxLoanAmount: null,
});
</script>
<style scoped>
.row-with-border {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}
.e-card {
  width: 1000px;
}
</style>
