<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredAccountCode"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Account codes"
          :no-data-label="
            accountCodeLoan.length
              ? 'No result found'
              : 'Select a section Loan/Laon Against Property/Personal Loan'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredAccountCode.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="q-gutter-y-md q-pb-xs-md">
              <div class="row items-center q-gutter-md">
                <div class="col-auto text-h4">Account code loan</div>
                <div class="col-auto">
                  <!-- <q-btn
                    size="md"
                    v-if="accountCodes.length"
                    label="Add code"
                    icon="add"
                    color="blue-7"
                  /> -->
                </div>
              </div>
              <div class="row items-center q-mt-lg">
                <div class="col-12 q-gutter-x-md flex items-center">
                  <span class="text-h6">Section</span>
                  <q-btn
                    v-if="accountCodeLoan.length"
                    color="red"
                    label="clear"
                    size="sm"
                    @click="resetAccountCodeLoanSection"
                  />
                </div>
                <div class="col-12">
                  <div class="q-gutter-lg">
                    <q-radio v-model="sectionCode" val="L" label="Loan" />
                    <q-radio
                      v-model="sectionCode"
                      val="LAP"
                      label="Loan Against Property"
                    />
                    <q-radio
                      v-model="sectionCode"
                      val="PL"
                      label="Personal Loan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-slot:header-cell="props">
            <q-th :props="props" style="font-size: 1rem">
              {{ props.col.label }}
            </q-th>
          </template>

          <!-- row design for screens > 800px-->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="actions" auto-width>
                <q-btn-group push unelevated>
                  <q-btn
                    icon="edit"
                    size="xs"
                    outline
                    color="accent"
                    v-if="!props.row.isEditing"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    v-if="!props.row.isEditing"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="props.row.isEditing"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="props.row.isEditing"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="accountCode" :props="props">
                <span>{{
                  accountCodes.find(
                    (item) => item.code === props.row.accountCode
                  )!.name
                }}</span>
              </q-td>
              <q-td key="id" :props="props">
                <template v-if="!props.row.isEditing">
                  {{
                    accountHeads.find(
                      (item) => item.id === props.row.accountId
                    )!.name
                  }}
                </template>
                <q-input
                  v-else
                  v-model="props.row.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="props.row.name ? 'green' : 'red'"
                  autofocus
                />
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->

          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="flex items-center">
                  <span class="text-weight-bold">{{ props.key }}</span>
                  <q-space />
                  <q-btn-group push unelevated>
                    <q-btn
                      icon="edit"
                      size="xs"
                      outline
                      color="accent"
                      v-if="!props.row.isEditing"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="delete"
                      size="xs"
                      outline
                      color="red"
                      v-if="!props.row.isEditing"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="check"
                      size="xs"
                      outline
                      color="green-10"
                      v-if="props.row.isEditing"
                    >
                      <q-tooltip>Save</q-tooltip>
                    </q-btn>
                    <q-btn
                      icon="close"
                      size="xs"
                      outline
                      color="red"
                      v-if="props.row.isEditing"
                    >
                      <q-tooltip>Cancel</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Code :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{
                          accountCodes.find(
                            (item) => item.code === props.row.accountCode
                          )!.name
                        }}
                      </template>
                      <q-input
                        v-else
                        v-model="props.row.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="props.row.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">account Name :</div>
                    <div class="col-12">
                      <template v-if="!props.row.isEditing">
                        {{
                          accountHeads.find(
                            (item) => item.id === props.row.accountId
                          )!.name
                        }}
                      </template>
                      <q-input
                        v-else
                        v-model="props.row.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="props.row.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, computed, watch, onMounted } from 'vue';

interface AccountCodes {
  code: string;
  name: string;
  section: string;
  visible: string;
  vtype: string;
}

interface AccountHeads {
  id: number;
  name: string;
}

interface AccountCodeLoan {
  id: number;
  accountCode: string;
  accountId: number;
  accountingCategoryCode: string;
}
const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/natureEntry', label: 'Account Code Loan' },
];
const sectionCode = ref(null);
const fetchingData = ref(false);
const accountCodes = ref<AccountCodes[]>([]);
const accountHeads = ref<AccountHeads[]>([]);
const accountCodeLoan = ref<AccountCodeLoan[]>([]);

const filteredAccountCode = computed(() => {
  return accountCodeLoan.value;
});
const columns: {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
}[] = [
  {
    name: 'actions',
    label: 'Actions',
    align: 'left',
    field: '',
  },
  {
    name: 'accountCode',
    required: true,
    align: 'left',
    field: 'accountCode',
    label: 'Account Code',
  },
  {
    name: 'id',
    required: true,
    align: 'left',
    field: 'id',
    label: 'Account Name',
  },
];

const resetAccountCodeLoanSection = () => {
  accountCodeLoan.value = [];
  sectionCode.value = null;
};

const fetchAccountCodeLoanByAccountingCategory = async (
  code: 'D' | 'L'
): Promise<Omit<AccountCodeLoan, 'isEditing'>[]> => {
  const rsp = await api(`accountCodeLoanByAccountingCategory/${code}`);

  if (!rsp.data) {
    return [];
  }
  return rsp.data;
};

watch(sectionCode, async () => {
  if (sectionCode.value) {
    fetchingData.value = true;
    const rsp = await fetchAccountCodeLoanByAccountingCategory(
      sectionCode.value
    );

    accountCodeLoan.value = rsp.map((data) => ({ ...data, isEditing: false }));
    fetchingData.value = false;
  }
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('accountCodeBySection/L');

  if (rsp.data) {
    accountCodes.value = rsp.data;
  }

  fetchingData.value = false;
});

onMounted(async () => {
  fetchingData.value = true;

  const rsp = await api.get('accountHead');
  if (rsp.data) {
    rsp.data.filter((item: { id: number; name: string }) => {
      let obj = {
        id: item.id,
        name: item.name,
      };
      accountHeads.value.push(obj);
    });
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
