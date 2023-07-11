<template>
  <q-dialog v-model="isActive" maximized @before-hide="close">
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
        class="scroll overflow-auto"
        :style="{ height: 'calc(100vh - 66px)' }"
      >
        <q-card-section
          class="q-pt-lg scroll overflow-auto"
          :style="{ height: 'calc(100% - 70px)' }"
        >
          <div class="row justify-center gap-2 q-col-gutter-x-sm">
            <div class="col-6 col-sm-3">
              <q-input
                label="Account Name"
                v-model="localAccountHead.name"
                outlined
                dense
                :rules="[(val:string|null) => !(val === null || val === '')]"
                :error="[null, ''].includes(localAccountHead.name)"
                no-error-icon
                @update:model-value="
                  (val) => {
                    if (val !== '' && val !== null && typeof val === 'string') {
                      localAccountHead.name = capitalCase(val);
                    }
                  }
                "
              />
            </div>
            <div class="col-6 col-sm-3">
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
            <div class="col-6 col-sm-3">
              <q-input
                label="Alias"
                v-model="localAccountHead.alias"
                outlined
                dense
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.alias = null;
                    } else if (val !== null && typeof val === 'string') {
                      localAccountHead.alias = capitalCase(val);
                    }
                  }
                "
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-10 col-sm-4 col-md-2">
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
                hide-bottom-space
                dropdown-icon="expand_more"
              />
            </div>
            <div
              class="col-10 col-sm-7 col-md-5"
              v-if="localAccountHead.accountType"
            >
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
                hide-bottom-space
                dropdown-icon="expand_more"
              />
            </div>
            <div class="col-10 col-sm-6 col-md-3">
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
                clear-icon="backspace"
                clearable
                dropdown-icon="expand_more"
                hide-bottom-space
              />
            </div>
          </div>
          <template v-if="localAccountHead.accountType === 'B'">
            <div class="row justify-center q-mt-sm q-col-gutter-sm">
              <div class="col-5 col-sm-4 col-md-3">
                <q-input
                  :mask="'#'.repeat(20)"
                  v-model.number="localAccountHead.accountNo"
                  dense
                  outlined
                  label="Bank A/c number"
                  @vue:unmounted="clerBankData"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        localAccountHead.accountNo = null;
                      }
                    }
                  "
                  hide-bottom-space
                />
              </div>
              <div class="col-7 col-sm-4 col-md-2">
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
                  clearable
                  clear-icon="backspace"
                  dropdown-icon="expand_more"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row justify-center q-mt-sm q-col-gutter-sm">
              <div class="col-6 col-md-3">
                <q-input
                  label="NACH Unique Id"
                  v-model="localAccountHead.nachUniqueId"
                  dense
                  outlined
                  :mask="'N'.repeat(20)"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        localAccountHead.nachUniqueId = null;
                      }
                    }
                  "
                  hide-bottom-space
                />
              </div>
              <div class="col-6 col-md-3">
                <q-input
                  label="NACH Bank Code"
                  v-model="localAccountHead.nachBankCode"
                  dense
                  outlined
                  :mask="'N'.repeat(11)"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        localAccountHead.nachBankCode = null;
                      }
                    }
                  "
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row justify-center q-mt-sm q-col-gutter-sm">
              <div class="col-6 col-md-3">
                <q-input
                  label="ECS User Code"
                  v-model="localAccountHead.ecsUserCode"
                  dense
                  outlined
                  :mask="'N'.repeat(7)"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        localAccountHead.ecsUserCode = null;
                      }
                    }
                  "
                  hide-bottom-space
                />
              </div>
              <div class="col-6 col-md-3">
                <q-input
                  label="MICR Code"
                  v-model="localAccountHead.micrCode"
                  dense
                  outlined
                  :mask="'N'.repeat(9)"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        localAccountHead.micrCode = null;
                      }
                    }
                  "
                  hide-bottom-space
                />
              </div>
            </div>
          </template>
          <div class="row items-center justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-10 col-sm-5 col-md-3">
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
                clear-icon="backspace"
                dropdown-icon="expand_more"
                clearable
                behavior="menu"
                hide-bottom-space
              />
            </div>
            <div class="col-10 col-sm-5 col-md-3">
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
                clear-icon="backspace"
                dropdown-icon="expand_more"
                clearable
                behavior="menu"
                options-dense
                hide-bottom-space
              />
            </div>
            <div class="col-auto">
              <div
                class="row items-center justify-evenly justify-sm-center justify-md-start"
              >
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
          </div>
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-6 col-sm-auto">
              <q-input
                label="Credit Days"
                v-model.number="localAccountHead.creditDays"
                outlined
                dense
                :mask="'#'.repeat(5)"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.creditDays = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div class="col-6 col-sm-auto">
              <q-input
                label="Interest Rate"
                v-model.number="localAccountHead.rateInt"
                outlined
                dense
                mask="######"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.rateInt = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div class="col-6 col-sm-auto">
              <q-input
                label="Share Percent"
                v-model.number="localAccountHead.sharePercent"
                outlined
                dense
                :mask="'#'.repeat(6)"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.sharePercent = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div class="col-10 col-sm-auto">
              <q-input
                outlined
                v-model="lockedOn"
                dense
                label="Locked Upto"
                hide-bottom-space
              >
                <q-popup-proxy
                  @before-show="
                    lockedOn ||
                      (lockedOn = date.formatDate(
                        new Date(),
                        lockedOnDateFormat
                      ))
                  "
                >
                  <q-date v-model="lockedOn" minimal :mask="lockedOnDateFormat">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Clear"
                        color="primary"
                        flat
                        v-close-popup
                        @click="lockedOn = null"
                      />
                      <q-btn
                        label="Reset"
                        color="primary"
                        flat
                        @click="() => resetLockedOnDate(true)"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-slot:append>
                  <q-icon name="calendar_month" class="cursor-pointer" />
                </template>
              </q-input>
            </div>
            <div
              class="col-10 col-sm-6 col-md-3"
              v-if="localAccountHead.accountType === 'B'"
            >
              <q-input
                v-model="localAccountHead.chequeFileName"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.chequeFileName = null;
                    }
                  }
                "
                label="Cheque File Name"
                dense
                outlined
                hide-bottom-space
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-10 col-sm-auto">
              <q-input
                label="Pan Number"
                v-model="localAccountHead.panNo"
                dense
                outlined
                mask="AAAAA####A"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.panNo = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div class="col-auto">
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
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-10 col-sm-5 col-md-4">
              <q-input
                label="Cheque Format File"
                v-model="localAccountHead.chequeFormatFile"
                dense
                outlined
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.chequeFormatFile = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div
              class="col-10 col-sm-5 col-md-4"
              v-if="['A', 'B', 'L'].includes(localAccountHead.accountType!)"
            >
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
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                hide-bottom-space
                behavior="menu"
                options-dense
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-10 col-sm-5 col-md-2">
              <q-select
                outlined
                dense
                label="Tax Class"
                v-model="localAccountHead.taxClassId"
                emit-value
                map-options
                option-value="id"
                option-label="name"
                :options="(inactiveFilter(taxClassOptions) as typeof taxClassOptions)"
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                hide-bottom-space
                behavior="menu"
                options-dense
              />
            </div>
            <div class="col-10 col-sm-5 col-md-2">
              <q-input
                dense
                outlined
                label="Tax No"
                v-model="localAccountHead.taxNo"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.taxNo = null;
                    }
                    if (typeof val === 'string' && val.length > 0) {
                      addressRequired = true;
                    }
                  }
                "
                mask="##AAAAA####AXAX"
                hide-bottom-space
              />
            </div>
            <div class="col-10 col-sm-5 col-md-2">
              <q-select
                dense
                outlined
                emit-value
                map-options
                label="Tax Category"
                v-model="localAccountHead.taxCategory"
                :options="getOptionsFromObject(taxCategories)"
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                behavior="menu"
                hide-bottom-space
                options-dense
              />
            </div>
          </div>
          <div
            class="row justify-center items-center q-col-gutter-x-sm q-mt-sm"
          >
            <div class="col-9 col-sm-7 col-md-4">
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
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                hide-bottom-space
                behavior="menu"
              />
            </div>
            <div class="col-3">
              <q-checkbox v-model="localAccountHead.tax" label="TAX" />
            </div>
          </div>
          <div class="row items-center justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-6 col-sm-4 col-md-3">
              <q-select
                v-model="localAccountHead.tdsClassId"
                outlined
                dense
                label="TDS Class"
                emit-value
                map-options
                option-label="name"
                option-value="id"
                :options="(inactiveFilter(tdsClassOptions) as typeof tdsClassOptions)"
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                hide-bottom-space
                behavior="menu"
              />
            </div>
            <div class="col-6 col-sm-4 col-md-3">
              <q-select
                v-model="localAccountHead.tdsType"
                outlined
                dense
                label="TDS Type"
                emit-value
                map-options
                :options="getOptionsFromObject(tdsType)"
                clearable
                clear-icon="backspace"
                dropdown-icon="expand_more"
                behavior="menu"
                hide-bottom-space
              />
            </div>
            <div class="col-auto q-gutter-x-md">
              <q-checkbox v-model="localAccountHead.tds" label="TDS" />
              <q-checkbox
                v-model="localAccountHead.tdsEditable"
                label="TDS Editable"
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-sm q-mt-sm">
            <div class="col-6 col-sm-auto col-md-2">
              <q-input
                v-model.number="localAccountHead.hsnCode"
                mask="##########"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.hsnCode = null;
                    }
                  }
                "
                dense
                outlined
                hide-bottom-space
                label="HSN Code"
              />
            </div>
            <div class="col-6 col-sm-auto col-md-2">
              <q-input
                hide-bottom-space
                v-model="localAccountHead.ndsi500ItemCode"
                mask="NNNNNNNNNN"
                dense
                outlined
                label="NDSI500 Item Code"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.ndsi500ItemCode = null;
                    }
                  }
                "
              />
            </div>
            <div class="col-6 col-sm-auto col-md-2">
              <q-input
                hide-bottom-space
                v-model="localAccountHead.nbs7ItemCode"
                mask="NNNNNNNNNN"
                dense
                outlined
                label="NBS7 Item Code"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.nbs7ItemCode = null;
                    }
                  }
                "
              />
            </div>
          </div>
          <div class="row justify-center q-mt-md">
            <div class="col-10 col-sm-7 col-md-5">
              <SearchableMultiselect
                label="Role Code"
                v-model="roleCodes"
                :options="roleCodeOptions"
                :max-chips="4"
                chip-key="value"
                :return-value="true"
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-x-sm q-mt-sm">
            <div class="col-6 col-sm-3 col-md-2">
              <q-input
                v-model.number="localAccountHead.drFromAmount"
                :mask="'#'.repeat(15)"
                dense
                outlined
                label="Dr From Amount"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.drFromAmount = null;
                    }
                  }
                "
                hide-bottom-space
              />
            </div>
            <div class="col-6 col-sm-3 col-md-2">
              <q-input
                hide-bottom-space
                v-model.number="localAccountHead.drToAmount"
                :mask="'#'.repeat(15)"
                dense
                outlined
                label="Dr To Amount"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.drToAmount = null;
                    }
                  }
                "
              />
            </div>
          </div>
          <div class="row justify-center q-col-gutter-x-sm q-mt-sm">
            <div class="col-6 col-sm-3 col-md-2">
              <q-input
                v-model.number="localAccountHead.crFromAmount"
                :mask="'#'.repeat(15)"
                dense
                outlined
                label="Cr From Amount"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.crFromAmount = null;
                    }
                  }
                "
              />
            </div>
            <div class="col-6 col-sm-3 col-md-2">
              <q-input
                v-model.number="localAccountHead.crToAmount"
                :mask="'#'.repeat(15)"
                dense
                outlined
                label="Cr To Amount"
                @update:model-value="
                  (val) => {
                    if (val === '') {
                      localAccountHead.crToAmount = null;
                    }
                  }
                "
              />
            </div>
          </div>

          <div class="row justify-center q-px-md q-col-gutter-md q-mt-sm">
            <div class="col-12 col-md-6">
              <q-expansion-item hide-expand-icon v-model="addressRequired">
                <template v-slot:header>
                  <div class="col-grow flex justify-md-end">
                    <q-checkbox
                      v-model="addressRequired"
                      label="Address required"
                    />
                  </div>
                </template>
                <div>
                  <AddressForm
                    v-model="address"
                    :address-id="props.accountHead?.addressId"
                    :reset-form="resetAddressForm"
                    @on-reset="resetAddressForm = false"
                  />
                </div>
              </q-expansion-item>
            </div>
            <div class="col-12 col-md-6">
              <q-expansion-item hide-expand-icon v-model="kycRequired">
                <template v-slot:header>
                  <q-checkbox v-model="kycRequired" label="Kyc" />
                </template>
                <div>
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
import type { AccountHead } from 'src/types/AccountHead';
import type { Address } from 'src/types/Address';
import { date } from 'quasar';
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import { useUserStore } from 'src/stores/user/userStore';
import { watch, computed, onMounted, reactive, ref, watchEffect } from 'vue';
import AddressForm from 'components/commonForms/AddressForm.vue';
import SearchableMultiselect from 'components/SearchableMultiselect.vue';
import KycDataList from './KycDataList.vue';
import { inactiveFilter } from 'src/utils/filters';
import {
  alertDialog,
  asyncConfirmDialog,
  onSuccess,
} from 'src/utils/notification';
import { capitalCase } from 'src/utils/string';

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
  chequeFileName: null,
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
  roleCode: null,
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
const initailAddress: Address = {
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
  id: null,
  cityId: null,
  geoLocation: null,
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
const lockedOnDateFormat = 'DD/MM/YYYY';

const emits = defineEmits(['close', 'updateList']);
const props = defineProps<{
  accountHead: AccountHead | null;
}>();

const { allowedCompany, allowedBranch } = storeToRefs(useUserStore());
const lockedOn = ref<string | null>(null);
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

const tdsClassOptions = ref<{ id: number; name: string; inactive: boolean }[]>(
  []
);
const statesOptions = ref<{ id: number; name: string }[]>([]);

const resetAddressForm = ref(false);
const isActive = ref(true);
const addressRequired = ref(false);
const kycRequired = ref(false);
const isResettingAccountHeadForm = ref(false);
const address = reactive<Address>({ ...initailAddress });
const kycData = ref<KycDataItem[]>([]);
const roleCodeOptions = ref<{ label: string; value: string }[]>([]);
const roleCodes = ref<string[]>([]);

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

const shouldSetKyc = computed(() => {
  if (!(props.accountHead && props.accountHead.kyc)) {
    return false;
  }
  return !!JSON.parse(props.accountHead.kyc).length;
});

const saveAccountHead = async () => {
  if (
    (localAccountHead.taxNo && !addressRequired.value) ||
    !isAddressFormValid.value
  ) {
    alertDialog('Please fill the address form');
    if (!addressRequired.value) {
      addressRequired.value = true;
    }
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

  if (localAccountHead.addressId && !addressRequired.value) {
    if (address.stateId && (await asyncConfirmDialog())) {
      await deleteAddress(localAccountHead.addressId);
    }
    localAccountHead.addressId = null;
  }

  if (roleCodes.value.length) {
    localAccountHead.roleCode = roleCodes.value.join(',');
  }

  if (lockedOn.value) {
    const [day, month, year] = lockedOn.value.split('/');
    const lockdeOnDate = new Date(`${month}/${day}/${year}`);
    localAccountHead.lockedOn = date.formatDate(lockdeOnDate, 'YYYY-MM-DD');
  } else {
    localAccountHead.lockedOn = null;
  }

  const payload = {
    accountHead: { ...localAccountHead },
    address: addressRequired.value ? { ...address } : {},
  };

  try {
    const rsp = await api.post('accountHead', payload);

    if (rsp.data) {
      onSuccess({ msg: rsp.data.displayMessage });

      localAccountHead[isEditing ? 'updatedOnBy' : 'createdOnBy'] =
        rsp.data[isEditing ? 'updatedOnBy' : 'createdOnBy'];

      emits('close');
      emits('updateList');
    }
  } catch (e) {
    // @ts-expect-error response data contains message if error occurs
    const msg = e.response.data.displayMessage || 'Some error occured';
    if (msg) {
      alertDialog(msg);
    }
  }
};

const deleteAddress = async (id: number) => {
  try {
    const rsp = await api.delete('address' + '/' + id);
    if (rsp.data) {
      onSuccess({ msg: 'Address ' + rsp.data.displayMessage });
    }
  } catch (e) {
    // @ts-expect-error response data contains message if error occurs
    const msg = e.response.data.displayMessage;
    if (msg) {
      alertDialog(msg);
    }
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
  isResettingAccountHeadForm.value = true;
  resetAddressForm.value = true;
  resetLockedOnDate(false);
  if (initialAccountHead.addressId) {
    addressRequired.value = true;
  }
  kycRequired.value = shouldSetKyc.value;
  setKycData(shouldSetKyc.value ? JSON.parse(props.accountHead!.kyc!) : []);

  if (initialAccountHead.roleCode) {
    roleCodes.value = initialAccountHead.roleCode.split(',');
  }
  let key: keyof AccountHead;
  for (key in initialAccountHead) {
    // @ts-expect-error intended overrite
    localAccountHead[key] = initialAccountHead[key];
  }
  setTimeout(() => (isResettingAccountHeadForm.value = false), 0);
};

const fixNullBooleanValues = () => {
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
    if (initialAccountHead[key as keyof AccountHead] === null) {
      // @ts-expect-error not assigning to id
      initialAccountHead[key as keyof AccountHead] = false;
    }
  });
};

const resetLockedOnDate = (setToday: boolean) => {
  const ressetedDate =
    initialAccountHead.lockedOn || (setToday ? Date.now() : null);
  const newDateformat = ressetedDate
    ? date.formatDate(ressetedDate, lockedOnDateFormat)
    : null;
  lockedOn.value = newDateformat;
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

const setKycData = (kycDataArray: KycDataItem[]) => {
  kycData.value = [...kycDataArray];
};

onMounted(async () => {
  const [
    accountGroupsRsp,
    subLedgerRsp,
    taxClassRsp,
    tdsClassRsp,
    bankFormatRsp,
    appRoles,
  ] = await Promise.all([
    api.get('accountGroup'),
    api.get('subLedger'),
    api.get('taxClass'),
    api.get('tdsClass'),
    api.get('bankFormat'),
    api.get('appRole'),
  ]);

  if (accountGroupsRsp.data) {
    accountGroups.value = [...accountGroupsRsp.data];
  }

  if (subLedgerRsp.data) {
    subLedgerOptions.value = [...subLedgerRsp.data];
  }

  if (taxClassRsp.data) {
    taxClassOptions.value = taxClassRsp.data;
  }

  if (tdsClassRsp.data) {
    tdsClassOptions.value = tdsClassRsp.data;
  }

  if (bankFormatRsp.data) {
    bankFormatOptions.value = bankFormatRsp.data;
  }

  if (appRoles.data) {
    roleCodeOptions.value = appRoles.data.map(
      (val: { code: string; name: string }) => ({
        label: val.name,
        value: val.code,
      })
    );
  }

  if (props.accountHead) {
    if (shouldSetKyc.value) {
      kycRequired.value = true;
      setKycData(JSON.parse(props.accountHead.kyc!));
    }
    if (props.accountHead.addressId !== null) {
      addressRequired.value = true;
    }
    if (props.accountHead.roleCode) {
      roleCodes.value = props.accountHead.roleCode.split(',');
    }

    if (props.accountHead.lockedOn) {
      lockedOn.value = date.formatDate(
        props.accountHead.lockedOn,
        lockedOnDateFormat
      );
    }
    let key: keyof AccountHead;
    for (key in props.accountHead) {
      // @ts-expect-error intended overrite
      initialAccountHead[key] =
        props.accountHead[key] === '' ? null : props.accountHead[key];
    }
    fixNullBooleanValues();
    for (key in initialAccountHead) {
      // @ts-expect-error intended overrite
      localAccountHead[key] = initialAccountHead[key];
    }
  }
});

watchEffect(() => {
  const { accountType } = localAccountHead;
  accountGroupsOptions.value = inactiveFilter(
    accountGroups.value.filter((group) => accountType === group.groupType)
  ) as AccountGroup[];
});

watch(
  () => address.countryId,
  async (newVal, oldVal) => {
    if (newVal) {
      if (oldVal) {
        localAccountHead.stateId = null;
      }

      const rsp = await api.get(`statesByCountry/${newVal}`);
      if (rsp.data) {
        statesOptions.value = [...rsp.data];
      }
    }
  },
  { immediate: true }
);

watch(
  () => localAccountHead.accountType,
  (newVal, oldVal) => {
    if (newVal !== oldVal && !isResettingAccountHeadForm.value) {
      localAccountHead.reverseAccountGroupCode = null;
      localAccountHead.accountGroupCode = null;
    }
  }
);
</script>

<style lang="scss"></style>
