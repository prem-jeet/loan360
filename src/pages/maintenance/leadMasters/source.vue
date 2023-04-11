<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredNatureEntry"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :no-data-label="
            source.length
              ? 'No result found'
              : 'Select a filter product and category'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredNatureEntry.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Source Lead</div>
                  <div class="col-auto">
                    <q-btn
                      color="blue-7"
                      icon="add"
                      label="Add source"
                      size="md"
                    />
                  </div>
                </div>
              </div>
              <div class="row items-center q-gutter-x-md">
                <div class="col-12 q-mb-sm">
                  <span class="text-h6">Filter</span>
                </div>
                <div class="col-auto">
                  <q-input
                    v-model="nameSearchQuery"
                    outlined
                    clearable
                    dense
                    rounded
                    placeholder="search"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>

                <div class="col-auto">
                  <q-checkbox v-model="checkBox" label=" In-Active" />
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
                  <q-btn icon="edit" size="xs" outline color="accent">
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'active' : 'In-active '"
                    size="xs"
                    outline
                    color="red"
                    @click="changeActive(props.rowIndex, props.row.inactive)"
                  >
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="createdOn" :props="props">
                {{
                  props.row.createdOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
              <q-td key="updatedOn" :props="props">
                {{
                  props.row.updatedOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
              <q-td key="inactiveOn" :props="props">
                {{
                  props.row.inactiveOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <!-- <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Code :</div>
                    <div class="col-12">
                      {{ props.row.name }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Account Name :</div>
                    <div class="col-12">
                      {{ props.row.createdOn }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12">
                      <q-checkbox
                        v-model="props.row.isApplication"
                        disable
                        label="isApplication"
                      />
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions align="right" class="q-py-md bg-grey-2">
                  <q-btn-group push unelevated>
                    <q-btn icon="edit" size="sm" outline color="accent">
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn icon="delete" size="sm" outline color="red">
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-card-actions>
              </q-card>
            </div>
          </template> -->
        </q-table>
      </div>
    </div>
  </div>
  <!-- <q-dialog v-model="isEntryModalActive">
    <q-card>
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl">{{
              mode === 'new'
                ? 'Add account code deposit'
                : 'Edit account code deposit'
            }}</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isEntryModalActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-sm">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-lg">
                <q-select
                  v-if="mode === 'new'"
                  v-model="newCodeDeposit.productCode"
                  dense
                  :options="products"
                  label="Select product"
                  map-options
                  menu-shrink
                  emit-value
                  outlined
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-if="mode === 'new'"
                  v-model="newCodeDeposit.categoryCode"
                  dense
                  :options="categorys"
                  label="Select category"
                  outlined
                  map-options
                  menu-shrink
                  emit-value
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeDeposit.accountCode"
                  dense
                  :options="accountCodes"
                  label="Select Code"
                  outlined
                  map-options
                  emit-value
                  menu-shrink
                  :rules="[(val:string) => val!=='']"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newCodeDeposit.accountId"
                  dense
                  use-input
                  map-options
                  menu-shrink
                  emit-value
                  hide-dropdown-icon
                  :options="accountNameOptions"
                  label="Account name"
                  outlined
                  :rules="[(val) => val !== null]"
                  @input-value="loadAccountNames"
                  ref="dropdown"
                />
              </div>

              <div
                v-if="
                  newCodeDeposit.productCode === 'FD' ||
                  newCodeDeposit.productCode === 'RD' ||
                  newCodeDeposit.productCode === 'DD'
                "
                class="col-12 q-mt-sm"
              >
                <q-checkbox
                  disable
                  v-model="newCodeDeposit.isApplication"
                  label="isApplication"
                />
              </div>
              <div v-else class="col-12 q-mt-sm">
                <q-checkbox
                  v-model="newCodeDeposit.isApplication"
                  label="isApplication"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="right" class="q-py-md bg-grey-2">
          <q-btn
            :label="editingRowIndex === null ? 'Add' : 'Save '"
            :icon="editingRowIndex === null ? 'add' : 'save '"
            color="teal"
            type="submit"
          />
          <q-btn label="Reset" color="red-5" type="reset" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog> -->
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { onSuccess, confirmDialog } from 'src/utils/notification';

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  { path: '/module/maintenance/source', label: 'Source' },
];

interface Source {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
}

const fetchingData = ref(false);
const nameSearchQuery = ref('');
const source = ref<Source[]>([]);
const sourceTemp = ref<Source[]>([]);
const checkBox = ref(false);

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
    name: 'name',
    required: true,
    align: 'left',
    field: 'name',
    label: 'sourceLead',
  },
  {
    name: 'createdOn',
    required: true,
    align: 'left',
    field: 'createdOn',
    label: 'Created',
  },
  {
    name: 'updatedOn',
    required: true,
    align: 'left',
    field: 'updatedOn',
    label: 'Updated',
  },
  {
    name: 'inactiveOn',
    required: true,
    align: 'left',
    field: 'inactiveOn',
    label: 'Inactive',
  },
];

const DateTimeOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour format
};

const filteredNatureEntry = computed(() => {
  return source.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
});

watch(nameSearchQuery, () => {
  source.value = sourceTemp.value.filter((item) => {
    return item.name
      .toLowerCase()
      .includes(nameSearchQuery.value.toLowerCase());
  });
});

const changeActive = async (rowIndex: number, state: boolean) => {
  confirmDialog(() => changeActiveConfirm(rowIndex, state), {
    msg: state
      ? 'Are you sure you want to make active ?'
      : 'Are you sure you want to make inactive ?',
  });
};

const changeActiveConfirm = async (index: number, state: boolean) => {
  const payLoad = {
    id: source.value[index].id,
  };
  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/sourceLead/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
    source.value[index].inactive = !state;
  }
};

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('sourceLead');

  if (rsp.data) {
    source.value = rsp.data.map(
      (item: {
        createdOn: string | number | Date;
        updatedOn: string | number | Date;
        inactiveOn: string | number | Date;
      }) => {
        return {
          ...item,
          createdOn: new Date(item.createdOn),
          updatedOn: new Date(item.updatedOn),
          inactiveOn: new Date(item.inactiveOn),
        };
      }
    );
    sourceTemp.value = source.value;
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
