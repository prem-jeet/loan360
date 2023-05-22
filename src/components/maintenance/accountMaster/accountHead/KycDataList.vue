<template>
  <q-card>
    <q-card-section class="row items-center bg-indigo-10 text-white">
      <div class="text-h6">Kyc</div>
      <q-space />
      <q-btn
        icon="add"
        padding="sm sm"
        round
        color="primary"
        v-if="localKycDataList.length"
        @click="kycModel = true"
      />
    </q-card-section>
    <q-card-section v-if="!localKycDataList.length">
      <div class="row q-gutter-y-md">
        <div class="col-12 flex flex-center text-body1">
          <q-icon name="warning" />
          <span class="q-ml-md">No items in list</span>
        </div>
        <div class="col-12 flex flex-center">
          <q-btn label="add kyc" color="primary" @click="kycModel = true" />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-else>
      <div class="row q-gutter-sm q-gutter-y-md">
        <div
          class="col-auto"
          v-for="(kycData, index) in localKycDataList"
          :key="kycData.kycCode"
        >
          <q-card :style="{ minWidth: '150px' }">
            <q-bar class="bg-grey-3">
              <div>KYC</div>
              <q-space />
              <div>
                <q-btn
                  dense
                  flat
                  icon="edit"
                  text-color="red"
                  @click="(editingRowindex = index), (kycModel = true)"
                />
                <q-btn
                  dense
                  flat
                  icon="close"
                  text-color="primary"
                  @click="() => removeKycdata(index)"
                />
              </div>
            </q-bar>
            <q-card-section class="q-gutter-y-sm">
              <div class="row text-weight-medium text-subtitle1">
                {{ getKycName(kycData.kycCode) }}
              </div>
              <div class="row" v-if="kycData.pattern">
                <div class="col-12">Pattern :</div>
                <div class="col-12 text-weight-medium text-subtitle1">
                  {{ kycData.pattern }}
                </div>
              </div>
              <div class="row">
                <div class="col-12">Value :</div>
                <div class="col-12 text-weight-medium text-subtitle1">
                  {{ kycData.value }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-card-section>
    <q-dialog
      v-model="kycModel"
      persistent
      @hide="clearDialogFields"
      @before-show="setDialogData"
    >
      <q-card :style="{ width: '350px' }">
        <q-card-section class="row items-center q-pb-none bg-grey-2">
          <div class="text-h6">
            {{ editingRowindex === null ? 'Add' : 'Edit' }} KYC
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-form @submit="submitHandler">
          <q-card-section class="q-pa-lg">
            <div class="row q-gutter-y-lg">
              <div class="col-12">
                <q-select
                  v-model="tempKycData.kycCode"
                  :options="computedKycOptions"
                  option-label="name"
                  option-value="code"
                  emit-value
                  map-options
                  label="Kyc type"
                  outlined
                  behavior="menu"
                  options-dense
                  @update:model-value="
                    () => {
                      tempKycData.pattern =
                        avalablePatternOptions.length === 1
                          ? avalablePatternOptions[0]
                          : null;
                      tempKycData.value = '';
                    }
                  "
                  :error="tempKycData.kycCode === null"
                  :rules="[() => tempKycData.kycCode !== null]"
                  hide-bottom-space
                  no-error-icon
                />
              </div>
              <div class="col-12">
                <q-select
                  :disable="avalablePatternOptions.length === 0"
                  v-model="tempKycData.pattern"
                  :options="avalablePatternOptions"
                  option-label="name"
                  option-value="code"
                  emit-value
                  map-options
                  :label="
                    avalablePatternOptions.length === 0
                      ? 'No pattern requierd'
                      : 'Patterns'
                  "
                  outlined
                  behavior="menu"
                  options-dense
                  :error="
                    avalablePatternOptions.length > 0 &&
                    tempKycData.pattern === null
                  "
                  :rules="[
                    () =>
                      avalablePatternOptions.length > 0 &&
                      tempKycData.pattern !== null,
                  ]"
                  hide-bottom-space
                  no-error-icon
                />
              </div>
              <div class="col-12">
                <q-input
                  :mask="computeMask"
                  v-model="tempKycData.value"
                  label="Value"
                  outlined
                  :error="
                    tempKycData.value === null || tempKycData.value === ''
                  "
                  :rules="[
                    () =>
                      tempKycData.value !== null && tempKycData.value !== '',
                  ]"
                  hide-bottom-space
                  no-error-icon
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions class="q-pa-md bg-grey-2" align="center">
            <q-btn
              :label="editingRowindex === null ? 'Add' : 'Edit'"
              :icon="editingRowindex === null ? 'add' : 'edit'"
              type="submit"
              color="green-5"
            />
            <q-btn
              label="reset"
              icon="restart_alt"
              type="button"
              color="red-5"
              @click="
                editingRowindex !== null ? setDialogData() : clearDialogFields()
              "
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';

import { reactive, onMounted, ref, computed } from 'vue';

type KycDataItem = {
  kycCode: string;
  pattern: string | null;
  value: string;
  id: number;
};
interface KycOptions {
  code: string;
  name: string;
  patterns: string;
  inactive: boolean;
}

interface Props {
  kycDataList: KycDataItem[];
}

const props = defineProps<Props>();
const emits = defineEmits(['update:kycDataList']);

const localKycDataList = computed(() => [...props.kycDataList]);
const availableKycOptions = ref<KycOptions[]>([]);
const computedKycOptions = computed(() => {
  if (!localKycDataList.value.length) {
    return availableKycOptions.value;
  }
  const selectedKycOptions = localKycDataList.value.map(
    ({ kycCode }) => kycCode
  );
  const filteredOptions = availableKycOptions.value.filter(
    ({ code }) => !selectedKycOptions.includes(code)
  );

  return editingRowindex.value === null
    ? filteredOptions
    : [
        ...filteredOptions,
        availableKycOptions.value.find(
          ({ code }) =>
            localKycDataList.value[editingRowindex.value!].kycCode === code
        ),
      ];
});

const kycModel = ref(false);
const editingRowindex = ref<null | number>(null);
const tempKycData = reactive<{
  kycCode: string | null;
  pattern: string | null;
  value: string | null;
}>({ kycCode: null, pattern: null, value: null });
const avalablePatternOptions = computed(() => {
  if (!tempKycData.kycCode) {
    return [];
  } else {
    const matchedKycData = availableKycOptions.value.find(
      (kyc) => kyc.code === tempKycData.kycCode
    );
    if (!matchedKycData?.patterns) {
      return [];
    }
    return matchedKycData.patterns.split(',');
  }
});

const computeMask = computed(() =>
  !tempKycData.pattern ? '' : tempKycData.pattern.replaceAll('9', '#')
);

const submitHandler = () => {
  const { pattern, value } = tempKycData;
  if (!pattern || pattern.length === value!.length) {
    if (editingRowindex.value === null) {
      emits('update:kycDataList', [
        ...localKycDataList.value,
        { ...tempKycData },
      ]);
    } else {
      const kycBeingEdited = localKycDataList.value[editingRowindex.value];
      kycBeingEdited.kycCode = tempKycData.kycCode!;
      kycBeingEdited.pattern = tempKycData.pattern;
      kycBeingEdited.value = tempKycData.value!;
      emits('update:kycDataList', [...localKycDataList.value]);
    }
  }
  kycModel.value = false;
};
const removeKycdata = (index: number) => {
  emits('update:kycDataList', [
    ...localKycDataList.value.slice(0, index),
    ...localKycDataList.value.slice(index + 1),
  ]);
};
const clearDialogFields = () => {
  editingRowindex.value = null;
  tempKycData.kycCode = null;
  tempKycData.pattern = null;
  tempKycData.value = null;
  // setTimeout(() => (tempKycData.value = null), 0);
};

const getKycName = (kycCode: string) => {
  if (!availableKycOptions.value.length) {
    return '';
  }
  return availableKycOptions.value.find(({ code }) => kycCode === code)!.name;
};

const setDialogData = () => {
  if (editingRowindex.value !== null) {
    const { kycCode, pattern, value } =
      localKycDataList.value[editingRowindex.value];
    tempKycData.pattern = pattern;
    tempKycData.kycCode = kycCode;
    setTimeout(() => (tempKycData.value = value), 0);
  }
};
onMounted(async () => {
  const rsp = await api.get('kyc');
  if (rsp.data) {
    availableKycOptions.value = rsp.data;
  }
});
</script>

<style scoped></style>
