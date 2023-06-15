<template>
  <q-dialog v-model="isActive" maximized>
    <q-card>
      <q-card-section class="row items-center bg-grey-2">
        <div class="text-h6">
          {{ accountHead ? 'Edit' : 'Add' }} Account Head
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="close" />
      </q-card-section>
      <q-form
        @submit="saveAccountHead"
        @reset="resetFormData"
        :style="{ maxHeight: 'calc(100vh - 65.5863px)' }"
        class="scroll overflow-auto"
      >
        <q-card-section class="q-col-gutter-y-sm">
          <div class="row q-gutter-md">
            <div class="col-auto">
              <q-input
                label="Code"
                v-model="localAccountHead.code"
                outlined
                dense
                :rules="[(val:string|null) => !(val === null || val === '')]"
                :error="
                  localAccountHead.code === null || localAccountHead.code === ''
                "
                no-error-icon
                :maxlength="10"
                counter
                @update:model-value="
                  (val) => {
                    if (typeof val === 'string') {
                      localAccountHead.code = val.toUpperCase();
                    }
                  }
                "
              />
            </div>
            <div class="col-auto">
              <q-input
                label="Account name"
                v-model="localAccountHead.name"
                outlined
                dense
                :rules="[(val:string|null) => !(val === null || val === '')]"
                :error="[null, ''].includes(localAccountHead.name)"
                no-error-icon
              />
            </div>
            <div class="col-auto">
              <q-input
                label="Alias"
                v-model="localAccountHead.alias"
                outlined
                dense
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.alias = null;
                    }
                  }
                "
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-2">
              <q-select
                label="A/c Type"
                v-model="localAccountHead.accountType"
                :rules="[(val:string) => val!== null]"
                :error="localAccountHead.accountType === null"
                no-error-icon
                emit-value
                map-options
                outlined
                dense
                :options="getOptionsFromObject(accountTypes)"
                behavior="menu"
              />
            </div>
            <div class="col-4" v-if="localAccountHead.accountType">
              <q-select
                label="A/c Group"
                v-model="localAccountHead.accountGroupCode"
                :rules="[(val:string) => val!== null]"
                :error="localAccountHead.accountGroupCode === null"
                no-error-icon
                emit-value
                map-options
                outlined
                dense
                option-label="name"
                option-value="code"
                behavior="menu"
                :options="accountGroupsOptions"
              />
            </div>
            <div class="col-3">
              <q-select
                label="Sub Ledger"
                v-model="localAccountHead.subLedgerCode"
                emit-value
                map-options
                outlined
                dense
                option-label="name"
                option-value="code"
                behavior="menu"
                :options="subLedgerOptions"
              />
            </div>
          </div>
          <template v-if="localAccountHead.accountType === 'B'">
            <div class="row q-gutter-md">
              <div class="col-2">
                <q-input
                  :mask="'#'.repeat(20)"
                  v-model.nuber="localAccountHead.accountNo"
                  dense
                  outlined
                  label="Bank A/c number"
                  @vnode-unmounted="clerBankData"
                />
              </div>
              <div class="col-3">
                <q-select
                  v-model="localAccountHead.bankFormatCode"
                  :options="bankFormatOptions"
                  option-label="name"
                  option-value="code"
                  emit-value
                  map-options
                  dense
                  outlined
                  label="Bank format"
                  behavior="menu"
                  options-dense
                />
              </div>
            </div>
            <div class="row q-gutter-md">
              <div class="col-3">
                <q-input
                  label="NACH Unique Id"
                  v-model="localAccountHead.nachUniqueId"
                  dense
                  outlined
                  :mask="'N'.repeat(20)"
                />
              </div>
              <div class="col-3">
                <q-input
                  label="NACH Bank Code"
                  v-model="localAccountHead.nachBankCode"
                  dense
                  outlined
                  :mask="'N'.repeat(11)"
                />
              </div>
              <div class="col-3"></div>
            </div>
            <div class="row q-gutter-md">
              <div class="col-3">
                <q-input
                  label="ECS User Code"
                  v-model="localAccountHead.ecsUserCode"
                  dense
                  outlined
                  :mask="'N'.repeat(7)"
                />
              </div>
              <div class="col-3">
                <q-input
                  label="MICR Code"
                  v-model="localAccountHead.micrCode"
                  dense
                  outlined
                  :mask="'N'.repeat(9)"
                />
              </div>
              <div class="col-3"></div>
            </div>
          </template>
          <div class="row q-gutter-md items-center">
            <div class="col-3">
              <q-select
                label="Company"
                v-model="localAccountHead.companyCode"
                :options="allowedCompany"
                emit-value
                map-options
                option-value="code"
                option-label="name"
                dense
                outlined
              />
            </div>
            <div class="col-3">
              <q-select
                label="Branch"
                v-model="localAccountHead.branchCode"
                :options="allowedBranch.filter((branch) => !branch.inactive)"
                emit-value
                map-options
                option-value="code"
                option-label="name"
                dense
                outlined
              />
            </div>
            <div class="col-4 q-gutter-x-md">
              <q-checkbox
                v-model="localAccountHead.showInAllBranches"
                label="Show In All Branchs"
              />
              <q-checkbox
                v-model="localAccountHead.automatic"
                label="Automatic"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-auto">
              <q-input
                label="Credit Days"
                v-model="localAccountHead.creditDays"
                outlined
                type="number"
                dense
                max="99999"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.creditDays = null;
                    }
                  }
                "
              />
            </div>
            <div class="col-auto">
              <q-input
                label="Interest Rate"
                v-model="localAccountHead.rateInt"
                outlined
                type="number"
                dense
                max="999999"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.creditDays = null;
                    }
                  }
                "
              />
            </div>
            <div class="col-auto">
              <q-input
                label="Share Percent"
                v-model="localAccountHead.sharePercent"
                outlined
                type="number"
                dense
                max="999999"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.creditDays = null;
                    }
                  }
                "
              />
            </div>
            <div class="col-auto">
              <q-input
                outlined
                v-model="localAccountHead.lockedOn"
                dense
                label="Locked Upto"
                @click="
                  if (localAccountHead.lockedOn === null) {
                    localAccountHead.lockedOn = date.formatDate(
                      new Date(),
                      'DD/MM/YYYY'
                    );
                  }
                "
              >
                <q-popup-proxy
                  @before-show="
                    localAccountHead.lockedOn ||
                      (localAccountHead.lockedOn = date.formatDate(
                        new Date(),
                        'DD/MM/YYYY'
                      ))
                  "
                >
                  <q-date
                    v-model="localAccountHead.lockedOn"
                    minimal
                    mask="DD/MM/YYYY"
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Clear"
                        color="primary"
                        flat
                        v-close-popup
                        @click="localAccountHead.lockedOn = null"
                      />
                      <q-btn
                        label="Reset"
                        color="primary"
                        flat
                        @click="resetLockedOnDate"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-slot:append>
                  <q-icon name="calendar_month" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-auto">
              <q-input
                label="Pan number"
                v-model="localAccountHead.panNo"
                dense
                outlined
                @update:model-value="
                  (val) => {
                    if (typeof val === 'string') {
                      localAccountHead.panNo = val.toUpperCase();
                    }
                  }
                "
                :rules="[
                  (val:string) => {
                    if(!val) {return true}
                    return new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).test(val)
                  },
                ]"
                maxlength="10"
                placeholder="XXXXX9999X"
              />
            </div>
            <div class="col-auto q-gutter-x-md">
              <q-checkbox
                v-model="localAccountHead.costCenter"
                label="Cost center"
              />
              <q-checkbox
                v-model="localAccountHead.refrenceAdjust"
                label="Adjust references"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-4">
              <q-input
                label="Cheque Format File"
                v-model="localAccountHead.chequeFormatFile"
                dense
                outlined
              />
            </div>
            <div class="col-3" v-if="reverseAcGroupCodeOptions.length">
              <q-select
                label="Reverse A/c Group Code"
                v-model="localAccountHead.reverseAccountGroupCode"
                emit-value
                map-options
                dense
                outlined
                :options="reverseAcGroupCodeOptions"
                option-label="name"
                option-value="code"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-2">
              <q-select
                outlined
                dense
                label="Tax Class"
                v-model="localAccountHead.taxClassId"
                emit-value
                map-options
                option-value="id"
                option-label="name"
                :options="taxClassOptions.filter((item) => !item.inactive)"
              />
            </div>
            <div class="col-3">
              <q-input
                dense
                outlined
                label="Tax No"
                :rules="[
                  (val:string) => {
                    if(!val) {return true}
                    return new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).test(val)},
                ]"
                v-model="localAccountHead.taxNo"
                @update:model-value="
                  (val) => {
                    if (typeof val === 'string') {
                      localAccountHead.taxNo = val.toUpperCase();
                    }
                  }
                "
                placeholder="99XXXXX9999X9Z9"
              />
            </div>
            <div class="col-2">
              <q-select
                dense
                outlined
                emit-value
                map-options
                label="Tax category"
                v-model="localAccountHead.taxCategory"
                :options="getOptionsFromObject(taxCategories)"
              />
            </div>
          </div>
          <div class="row q-gutter-md items-center">
            <div class="col-2">
              <q-select
                options-dense
                dense
                outlined
                emit-value
                map-options
                label="State"
                v-model="localAccountHead.stateId"
                :options="statesOptions"
                option-label="name"
                option-value="id"
              />
            </div>
            <div class="col-auto">
              <q-checkbox v-model="localAccountHead.tax" label="TAX" />
            </div>
          </div>
          <div class="row q-gutter-md items-center">
            <div class="col-2">
              <q-select
                v-model="localAccountHead.tdsClassId"
                outlined
                dense
                label="TDS class"
                emit-value
                map-options
                option-label="name"
                option-value="id"
                :options="tdsClassOptions"
              />
            </div>
            <div class="col-2">
              <q-select
                v-model="localAccountHead.tdsType"
                outlined
                dense
                label="TDS type"
                emit-value
                map-options
                :options="getOptionsFromObject(tdsType)"
              />
            </div>
            <div class="col-auto q-gutter-x-md">
              <q-checkbox v-model="localAccountHead.tds" label="TDS" />
              <q-checkbox
                v-model="localAccountHead.tdsEditable"
                label="TDS editable"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-2">
              <q-input
                type="number"
                v-model="localAccountHead.hsnCode"
                max="9999999999"
                min="1"
                dense
                outlined
                label="HSN code"
              />
            </div>
            <div class="col-2">
              <q-input
                type="number"
                v-model="localAccountHead.ndsi500ItemCode"
                max="9999999999"
                min="1"
                dense
                outlined
                label="NDSI500 item code"
              />
            </div>
            <div class="col-2">
              <q-input
                type="number"
                v-model="localAccountHead.nbs7ItemCode"
                max="9999999999"
                min="1"
                dense
                outlined
                label="NBS7 item code"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-4">
              <q-input
                type="number"
                v-model="localAccountHead.drFromAmount"
                max="999999999999999"
                min="0"
                dense
                outlined
                label="Dr From Amount"
              />
            </div>
            <div class="col-4">
              <q-input
                type="number"
                v-model="localAccountHead.drToAmount"
                max="999999999999999"
                min="0"
                dense
                outlined
                label="Dr To Amount"
              />
            </div>
          </div>
          <div class="row q-gutter-md">
            <div class="col-4">
              <q-input
                type="number"
                v-model="localAccountHead.crFromAmount"
                max="999999999999999"
                min="0"
                dense
                outlined
                label="Cr From Amount"
              />
            </div>
            <div class="col-4">
              <q-input
                type="number"
                v-model="localAccountHead.crToAmount"
                max="999999999999999"
                min="0"
                dense
                outlined
                label="Cr To Amount"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 col-md-6">
              <q-expansion-item hide-expand-icon v-model="addressRequired">
                <template v-slot:header>
                  <q-checkbox
                    v-model="addressRequired"
                    label="Address required"
                  />
                </template>
                <div class="q-px-lg q-py-md">
                  <AddressForm v-model="address" />
                </div>
              </q-expansion-item>
            </div>
            <div class="col-12 col-md-6">
              <q-expansion-item hide-expand-icon v-model="kycRequired">
                <template v-slot:header>
                  <q-checkbox v-model="kycRequired" label="Kyc" />
                </template>
                <div class="q-px-lg q-py-md">
                  <KycDataList v-model:kycDataList="kycData" />
                </div>
              </q-expansion-item>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center" class="q-py-md bg-grey-2">
          <q-btn
            :label="props.accountHead ? 'Save' : 'Add'"
            :icon="props.accountHead ? 'save' : 'add'"
            type="submit"
            color="primary"
          />
          <q-btn color="red-5" label="reset" type="reset" icon="restart_alt" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user/userStore';
import { watch, computed, onMounted, reactive, ref, watchEffect } from 'vue';
import AddressForm from 'components/commonForms/AddressForm.vue';
import KycDataList from './KycDataList.vue';
import { inactiveFilter } from 'src/utils/filters';
import { alertDialog } from 'src/utils/notification';

interface AccountHead {
  id?: number;
  accountGroupCode: string | null;
  accountNo: string | null;
  accountType: string | null;
  addressId: string | null;
  alias: string | null;
  attachments: string | null;
  automatic: boolean;
  bankFormatCode: string | null;
  branchCode: string | null;
  chequeFormatFile: string | null;
  code: string | null;
  companyCode: string | null;
  costCenter: boolean | null;
  createdOn: Date | string | null;
  createdOnBy: string | null;
  crFromAmount: number | null;
  crToAmount: number | null;
  creditDays: number | null;
  drFromAmount: number | null;
  drToAmount: number | null;
  ecsUserCode: string | null;
  hsnCode: string | null;
  inactive: boolean;
  inactiveOn: string | null;
  inactiveOnBy: string | null;
  kyc: string | null;
  lockedOn: string | null;
  lockedUpdatedOn: string | null;
  micrCode: string | null;
  name: string | null;
  nachBankCode: string | null;
  nachUniqueId: string | null;
  nbs7ItemCode: string | null;
  ndsi500ItemCode: string | null;
  panNo: string | null;
  rateInt: number | null;
  refrenceAdjust: boolean | null;
  reverseAccountGroupCode: string | null;
  roleCode: string | null;
  sharePercent: number | null;
  showInAllBranches: boolean;
  stateId: number | null;
  subLedgerCode: string | null;
  tds: boolean | null;
  tdsClassId: number | null;
  tdsEditable: boolean | null;
  tdsType: string | null;
  tax: boolean | null;
  taxCategory: string | null;
  taxClassId: number | null;
  taxNo: string | null;
  updatedOn: Date | string | null;
  updatedOnBy: string | null;
}
interface Address {
  address1: string | null;
  address2: string | null;
  address3: string | null;
  city: string | null;
  countryId: number | null;
  fax: string | null;
  mobile: string | null;
  name: string | null;
  phone1: string | null;
  phone1Extn: string | null;
  phone2: string | null;
  phone2Extn: string | null;
  pincode: string | null;
  stateId: number | null;
  std: string | null;
}
type KycDataItem = {
  kycCode: 'string';
  pattern: 'string';
  value: 'string';
  id: number;
};
interface AccountGroup {
  inactive: boolean;
  code: string;
  name: string;
  groupType: keyof typeof accountTypes;
}

const initialAccountHead: AccountHead = {
  accountGroupCode: null,
  accountNo: null,
  accountType: null,
  addressId: null,
  alias: null,
  attachments: null,
  automatic: false,
  bankFormatCode: null,
  branchCode: null,
  chequeFormatFile: null,
  code: null,
  companyCode: null,
  costCenter: false,
  createdOn: null,
  createdOnBy: null,
  crFromAmount: null,
  crToAmount: null,
  creditDays: null,
  drFromAmount: null,
  drToAmount: null,
  ecsUserCode: null,
  hsnCode: null,
  inactive: false,
  inactiveOn: null,
  inactiveOnBy: null,
  kyc: null,
  lockedOn: null,
  lockedUpdatedOn: null,
  micrCode: null,
  name: null,
  nachBankCode: null,
  nachUniqueId: null,
  nbs7ItemCode: null,
  ndsi500ItemCode: null,
  panNo: null,
  rateInt: null,
  refrenceAdjust: false,
  reverseAccountGroupCode: null,
  roleCode: '',
  sharePercent: null,
  showInAllBranches: false,
  stateId: null,
  subLedgerCode: null,
  tax: false,
  taxCategory: null,
  taxClassId: null,
  taxNo: null,
  tds: false,
  tdsClassId: null,
  tdsEditable: false,
  tdsType: null,
  updatedOn: null,
  updatedOnBy: null,
};

const accountTypes = {
  A: 'Assets',
  L: 'Liabilities',
  C: 'Cash',
  B: 'Bank',
  I: 'Income',
  E: 'Expense',
};

const taxCategories = {
  I: 'Inclusive',
  E: 'Exclusive',
};

const tdsType = {
  I: 'Individual',
  O: 'Other',
};

const emits = defineEmits(['close']);
const props = defineProps<{
  accountHead: AccountHead | null;
}>();

const { allowedCompany, allowedBranch } = storeToRefs(useUserStore());

const localAccountHead = reactive<AccountHead>(
  props.accountHead ? { ...props.accountHead } : { ...initialAccountHead }
);
const accountGroups = ref<AccountGroup[]>([]);
const accountGroupsOptions = ref<AccountGroup[]>([]);
const bankFormatOptions = ref<{ code: string; name: string }[]>([]);
const subLedgerOptions = ref<{ code: string; name: string }[]>([]);
const reverseAcGroupCodeOptions = computed(() => {
  if (!localAccountHead.accountType) {
    return [];
  }
  const key = ['A', 'B'].includes(localAccountHead.accountType!) ? 'L' : 'A';

  return inactiveFilter(
    accountGroups.value.filter((group) => key === group.groupType)
  ) as AccountGroup[];
});
const taxClassOptions = ref<
  { id: number; taxType: string; name: string; inactive: boolean }[]
>([]);

const tdsClassOptions = ref<{ id: number; name: string }[]>([]);
const statesOptions = ref<{ id: number; name: string }[]>([]);

const isActive = ref(true);
const addressRequired = ref(false);
const kycRequired = ref(false);

const address = reactive<Address>({
  address1: null,
  address2: null,
  address3: null,
  city: null,
  countryId: 1,
  fax: null,
  mobile: null,
  name: null,
  phone1: null,
  phone1Extn: null,
  phone2: null,
  phone2Extn: null,
  pincode: null,
  stateId: null,
  std: null,
});
const kycData = ref<KycDataItem[]>([]);

const isAddressFormValid = computed(
  () =>
    !(
      addressRequired.value &&
      !(address.city && address.countryId !== null && address.stateId !== null)
    )
);
const isKycFormValid = computed(() =>
  kycRequired.value ? !!kycData.value.length : true
);
const computedKycIdList = computed(() => {
  const list: number[] = [];

  kycData.value.forEach((val) => {
    if (val.id !== undefined) {
      list.push(val.id);
    }
  });

  return list;
});

const saveAccountHead = () => {
  if (!isAddressFormValid.value) {
    alertDialog('Please fill the address form');
    return;
  }
  if (!isKycFormValid.value) {
    alertDialog('KYC required');
    return;
  }

  const now = new Date();
  const isEditing = !!props.accountHead;

  localAccountHead[isEditing ? 'updatedOn' : 'createdOn'] = now;

  if (kycData.value.length) {
    updateKycIds();
    localAccountHead.kyc = JSON.stringify(kycData.value);
  }

  if (isEditing) {
    // call editing api
  } else {
    // call create new api
  }
};

const close = () => emits('close');

const getOptionsFromObject = (obj: { [key: string]: string }) => {
  return Object.keys(obj).map((key) => ({
    value: key,
    label: obj[key as keyof typeof obj],
  }));
};

const clerBankData = () => {
  localAccountHead.accountNo = null;
  localAccountHead.bankFormatCode = null;
  localAccountHead.nachUniqueId = null;
  localAccountHead.nachBankCode = null;
  localAccountHead.ecsUserCode = null;
  localAccountHead.micrCode = null;
};

const resetFormData = () => {
  const temp = props.accountHead || initialAccountHead;
  console.table(temp);
};
const setBooleanVariables = () => {
  const booleanKeys = [
    'automatic',
    'costCenter',
    'refrenceAdjust',
    'showInAllBranches',
    'tds',
    'tdsEditable',
    'tax',
  ];
  booleanKeys.forEach((key) => {
    if (
      props.accountHead &&
      props.accountHead[key as keyof AccountHead] === null
    ) {
      // @ts-expect-error not assigning to id
      localAccountHead[key as keyof AccountHead] = false;
    }
  });
};

const resetLockedOnDate = () => {
  localAccountHead.lockedOn =
    props.accountHead?.lockedOn || date.formatDate(Date.now(), 'DD/MM/YYYY');
};

const setKycData = () => {
  if (props.accountHead && props.accountHead.kyc) {
    const kyc = props.accountHead.kyc;
    if (JSON.parse(kyc).length) kycRequired.value = true;
    kycData.value = [...JSON.parse(props.accountHead.kyc)];
  }
};
const updateKycIds = () => {
  if (props.accountHead) {
    let maxId = Math.max(...computedKycIdList.value);
    kycData.value = kycData.value.map((val) => {
      if (val.id !== undefined) {
        return val;
      }
      return { ...val, id: ++maxId };
    });
  } else {
    kycData.value = kycData.value.map((val, index) => ({
      ...val,
      id: index + 1,
    }));
  }
};

onMounted(async () => {
  if (props.accountHead) {
    setBooleanVariables();
    setKycData();
  }
  const accountGroupsRsp = await api.get('accountGroup');

  if (accountGroupsRsp.data) {
    accountGroups.value = [...accountGroupsRsp.data];
  }

  const subLedgerRsp = await api.get('subLedger');
  if (subLedgerRsp.data) {
    subLedgerOptions.value = [...subLedgerRsp.data];
  }

  const taxClassRsp = await api.get('taxClass');
  if (taxClassRsp.data) {
    taxClassOptions.value = taxClassRsp.data;
  }

  const tdsClassRsp = await api.get('tdsClass');
  if (tdsClassRsp.data) {
    tdsClassOptions.value = tdsClassRsp.data;
  }

  const bankFormatRsp = await api.get('bankFormat');
  if (bankFormatRsp.data) {
    bankFormatOptions.value = bankFormatRsp.data;
  }
});

watchEffect(() => {
  const { accountType } = localAccountHead;

  accountGroupsOptions.value = inactiveFilter(
    accountGroups.value.filter((group) => accountType === group.groupType)
  ) as AccountGroup[];
});
watchEffect(async () => {
  const { countryId } = address;
  if (countryId !== null) {
    localAccountHead.stateId = null;
    const rsp = await api.get(`statesByCountry/${countryId}`);
    if (rsp.data) {
      statesOptions.value = [...rsp.data];
    }
  }
});
watch(
  () => localAccountHead.accountType,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      localAccountHead.reverseAccountGroupCode = null;
      localAccountHead.accountGroupCode = null;
    }
  }
);
</script>

<style lang="scss"></style>
