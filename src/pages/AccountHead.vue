<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <div class="row q-gutter-md">
      <div class="col-12">
        <div class="row q-gutter-md">
          <div class="col-4">
            <q-select
              :options="allowedCompany"
              label="Company"
              v-model="searchObject.companyCode"
              option-label="name"
              option-value="code"
              emit-value
              map-options
            />
          </div>
          <div class="col-4">
            <q-select
              :options="allowedBranch"
              label="Branch"
              v-model="searchObject.branchCode"
              option-label="name"
              option-value="code"
              emit-value
              map-options
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row q-gutter-md">
          <div class="col-4">
            <q-select
              :options="accountGroupOptions"
              label="A/c Group"
              v-model="searchObject.accountGroupCode"
              option-label="name"
              option-value="code"
              emit-value
              map-options
            />
          </div>
          <div class="col-4">
            <q-select
              :options="subLedgerCodeOptions"
              label="Sub-Ledger Code"
              v-model="searchObject.subLedgerCode"
              option-label="name"
              option-value="code"
              emit-value
              map-options
            />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row q-gutter-md items-center">
          <div class="col-auto">Name:</div>
          <div class="col-auto">
            <q-option-group
              v-model="nameSearchcriteria"
              :options="[
                { label: 'Starts with', value: 'sw' },
                { label: 'Contains', value: 'c' },
              ]"
              color="primary"
              inline
            />
          </div>
          <div class="col-2">
            <q-input
              v-model="searchObject.accountName"
              placeholder="Account name (min 3 char)"
              outlined
              dense
            />
          </div>
          <div class="col-auto">
            <q-checkbox
              dense
              v-model="searchObject.inActive"
              label="In-Active"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="grey-4"
              text-color="black"
              label="Search"
              icon="search"
              @click="search"
            />
          </div>
          <div class="col-auto">
            <q-btn
              color="red-5"
              text-color="black"
              label="reset"
              icon="restart_alt"
              @click="resetSearchParameters"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user/userStore';
import { onMounted, reactive, ref, watch } from 'vue';

interface SearchObject {
  companyCode: string | null;
  branchCode: string | null;
  accountGroupCode: string | null;
  subLedgerCode: string | null;
  accountName: string | null;
  inActive: boolean;
}

const isPerformingAction = ref(false);
const { allowedCompany, allowedBranch } = storeToRefs(useUserStore());
const accountGroupOptions = ref<{ code: string; name: string }[]>([]);
const subLedgerCodeOptions = ref<{ code: string; name: string }[]>([]);

const searchObject = reactive<SearchObject>({
  companyCode: null,
  branchCode: null,
  accountGroupCode: null,
  subLedgerCode: null,
  accountName: null,
  inActive: false,
});
const nameSearchcriteria = ref<'sw' | 'c'>('sw');

const buildQuery = () => {
  const parameters = [
    'companyCode',
    'branchCode',
    'accountGroupCode',
    'subLedgerCode',
  ].reduce((acc, key) => {
    const parameter = searchObject[key as keyof SearchObject];
    if (parameter) {
      return acc + ` and ${key}='${parameter}'`;
    }
    return acc;
  }, '');
  const nameParameter = searchObject.accountName
    ? ` and lower(name) like lower('${
        nameSearchcriteria.value === 'c' ? '%' : ''
      }${searchObject.accountName}%')`
    : '';

  const inActiveParameter = searchObject.inActive
    ? ' and c.inactive= true'
    : ' and (c.inactive is null or c.inactive is false)';
  return `1=1 ${parameters}${nameParameter}${inActiveParameter} ORDER BY c.name ASC`;
};

const resetSearchParameters = () => {
  searchObject.companyCode = null;
  searchObject.branchCode = null;
  searchObject.accountGroupCode = null;
  searchObject.subLedgerCode = null;
  searchObject.accountName = null;
  searchObject.inActive = false;
  nameSearchcriteria.value = 'sw';
};

const search = async () => {
  const query = buildQuery();

  const rsp = await api.post('accountHead/search', {
    pageNo: 1,
    pageSize: 10,
    where: query,
  });

  if (rsp.data) {
    console.log(rsp.data);
  }
};

watch(searchObject, () => {
  console.log(searchObject);
});

onMounted(async () => {
  isPerformingAction.value = true;
  const accountGroup = await api.get('accountGroup');
  if (accountGroup.data) {
    accountGroupOptions.value = [...accountGroup.data];
  }
  const subLedger = await api.get('subLedger');
  if (subLedger.data) {
    subLedgerCodeOptions.value = [...subLedger.data];
  }
});
</script>

<style scoped></style>

<!-- 
    1=1  
    and 
    companyCode='IKF' 
    and 
    branchCode='ANK' 
    and 
    accountGroupCode='EXPENSES_IND' 
    and
    subLedgerCode='COLLEXEC' 
    and 
    lower(name) like lower('a%')  
    and 
    (c.inactive is null or c.inactive is false) 
    ORDER BY c.name ASC
-->
