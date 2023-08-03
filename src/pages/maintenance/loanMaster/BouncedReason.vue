<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredBouncedReason"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredBouncedReason.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-x-md q-gutter-y-sm">
              <div class="col-auto text-h6">Bounced Reason</div>
              <div class="col-auto">
                <q-btn
                  color="blue-7"
                  icon="add"
                  label="Add new"
                  size="md"
                  class="full-width"
                  @click="isBouncedReasonFormActive = true"
                />
              </div>
            </div>

            <div class="row full-width q-mt-lg q-mb-sm items-center">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="filter.name"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Search Bounced Reason"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        filter.name = null;
                      }
                    }
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-auto">
                <div class="flex items-center justify-end">
                  <q-checkbox v-model="filter.inactive" label=" In-Active" />
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
                    @click="
                      editingRowId = props.row.id;
                      isBouncedReasonFormActive = true;
                    "
                  />
                  <q-btn
                    :label="`${props.row.inactive ? '' : 'de-'}activate`"
                    size="xs"
                    outline
                    color="red"
                    @click="() => toggleActiveState(props.row)"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="name" :props="props">
                {{ capitalCase(props.row.name) }}
              </q-td>
              <q-td key="technicalReason" :props="props">
                <q-icon
                  size="xs"
                  :name="
                    props.row.technicalReason === null ||
                    !props.row.technicalReason
                      ? 'cancel'
                      : 'check_circle'
                  "
                  :color="
                    props.row.technicalReason === null ||
                    !props.row.technicalReason
                      ? 'red-10'
                      : 'teal-10'
                  "
                />
              </q-td>
              <q-td
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                :key="key"
                :props="props"
              >
                {{ formatDate(props.row[key], 'DD/MM/YYYY @hh:mmA') }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="q-pb-none">
                  <div class="text-weight-medium">
                    {{ props.colsMap.name.label }}
                  </div>
                  <div>
                    {{ capitalCase(props.row.name) }}
                  </div>
                </q-card-section>
                <q-card-section class="q-pb-none">
                  <div class="text-weight-medium">
                    {{ props.colsMap.technicalReason.label }}
                  </div>
                  <q-icon
                    size="xs"
                    :name="
                      props.row.technicalReason === null ||
                      !props.row.technicalReason
                        ? 'cancel'
                        : 'check_circle'
                    "
                    :color="
                      props.row.technicalReason === null ||
                      !props.row.technicalReason
                        ? 'red-10'
                        : 'teal-10'
                    "
                  />
                </q-card-section>
                <template
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                  :key="key"
                >
                  <q-card-section v-if="props.row[key]" class="q-pb-none">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{ formatDate(props.row[key], 'DD/MM/YYYY @hh:mmA') }}
                    </div>
                  </q-card-section>
                </template>

                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    @click="
                      editingRowId = props.row.id;
                      isBouncedReasonFormActive = true;
                    "
                  />

                  <q-btn
                    :label="`${props.row.inactive ? '' : 'de-'}activate`"
                    size="sm"
                    color="red"
                    @click="() => toggleActiveState(props.row)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog
      v-model="isBouncedReasonFormActive"
      @before-hide="editingRowId = null"
      @before-show="setInitialFormData"
    >
      <q-card :style="{ minWidth: 'calc(250px + 20vw)' }" class="column">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ `${editingRowId ? 'Edit' : 'New'} Bounced Reason` }}
          </div>
          <q-space />
          <q-btn
            @click="isBouncedReasonFormActive = false"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>

        <q-form
          @reset="setInitialFormData"
          class="col-grow column"
          @submit.prevent="handleBouncedReasonFormsubmit"
        >
          <q-card-section
            class="q-pa-md col-grow column justify-evenly"
            :style="{ minHeight: '25vh' }"
          >
            <q-input
              label="Name"
              v-model="formData.bouncedReason"
              @update:model-value="
                (val) => {
                  if (val === '') {
                    formData.bouncedReason === null;
                  }
                }
              "
              :error="!formData.bouncedReason"
              :rules="[(val) => !!val]"
              hide-bottom-space
              no-error-icon
              outlined
            />

            <div class="flex justify-start">
              <q-checkbox
                v-model="formData.technicalReason"
                label="Technical Reason"
                left-label
              />
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-py-md bg-grey-2">
            <q-btn
              :label="editingRowId === null ? 'Add' : 'Save '"
              :icon="editingRowId === null ? 'add' : 'save '"
              color="teal"
              type="submit"
            />
            <q-btn label="Reset" color="red-5" type="reset" icon="refresh" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from 'src/types/Common';
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import {
  ref,
  onMounted,
  computed,
  reactive,
  watch,
  resolveDirective,
} from 'vue';

import { formatDate } from 'src/utils/date';
import { capitalCase } from 'src/utils/string';
import { asyncConfirmDialog } from 'src/utils/notification';
import { usePut } from 'src/composables/apiCalls';

interface BouncedReason {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  technicalReason: boolean;
}

interface Form {
  bouncedReason: string | null;
  technicalReason: boolean;
}

interface Filter {
  name: string | null;
  inactive: boolean;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/bouncedReason',
    label: 'Loan Master',
  },
  {
    path: '/module/maintenance/loanMaster/bouncedReason',
    label: 'Bounced Reason',
  },
];

const columns: TableColumn[] = [
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
    label: 'Bounced Reason',
  },
  {
    name: 'technicalReason',
    required: true,
    align: 'center',
    field: 'technicalReason',
    label: 'Technical Reason',
  },
  {
    name: 'createdOn',
    required: true,
    align: 'left',
    field: 'createdOn',
    label: 'Created On',
  },
  {
    name: 'updatedOn',
    required: true,
    align: 'left',
    field: 'updatedOn',
    label: 'Updated On',
  },
  {
    name: 'inactiveOn',
    required: true,
    align: 'left',
    field: 'inactiveOn',
    label: 'In-Active On',
  },
];

const formData = ref<Form>({
  bouncedReason: null,
  technicalReason: false,
});

const filter = reactive<Filter>({
  inactive: false,
  name: null,
});

const fetchingData = ref(false);
const isBouncedReasonFormActive = ref(false);
const bouncedReason = ref<BouncedReason[]>([]);
const editingRowId = ref<number | null>(null);

const filteredBouncedReason = computed(() => {
  const { name, inactive } = filter;
  const filteredArray = bouncedReason.value.filter((reason) => {
    const isNameMatched =
      !name || reason.name.toLowerCase().includes(name.toLowerCase());
    const isInactiveMatched =
      reason.inactive !== null && reason.inactive === inactive;
    return isNameMatched && isInactiveMatched;
  });
  return filteredArray;
});

const initialFormData = computed(() => {
  const temp: Form = {
    bouncedReason: null,
    technicalReason: false,
  };
  if (editingRowId.value) {
    const editingRow = bouncedReason.value.find(
      (reason) => reason.id === editingRowId.value
    );
    if (editingRow) {
      temp.bouncedReason = editingRow.name;
      temp.technicalReason =
        editingRow.technicalReason !== null && editingRow.technicalReason;
    }
  }
  return temp;
});

const setInitialFormData = () =>
  (formData.value = { ...initialFormData.value });

const toggleActiveState = async (row: BouncedReason) => {
  const inActive = row.inactive;

  const confirmed = await asyncConfirmDialog({
    msg: `Are you sure you want to ${inActive ? '' : 'De-'}Activate`,
  });

  if (confirmed) {
    const str = inActive ? 'active' : 'inactive';
    const rsp = await usePut(
      '/bouncedReason/' + str,
      { id: row.id },
      'Unable to change active status.'
    );
    if (rsp) {
      row.inactive = !row.inactive;
      if (!inActive) {
        row.inactiveOn = new Date().toISOString();
      }
    }
  }
};

const isNameDuplicate = (name: string) => {
  const isDuplicate = !!bouncedReason.value.some((item) => {
    return (
      item.name === name &&
      !(editingRowId.value && editingRowId.value === item.id)
    );
  });

  return isDuplicate;
};
const handleBouncedReasonFormsubmit = () => {
  console.log('Form submit');
};

/* const setFormData = () => {
  const index = bouncedReason.value.findIndex(
    (obj) => obj.id === editingRowId.value
  );
  newSouce.name = index >= 0 ? bouncedReason.value[index].name : '';
  newSouce.id = index >= 0 ? bouncedReason.value[index].id : null;
  newSouce.technicalReason =
    index >= 0 ? bouncedReason.value[index].technicalReason : false;
};

const editEntryConfirmed = (id: number, index: number) => {
  editingRowIndex.value = index;
  editingRowId.value = id;
  setFormData();
};

const editEntry = (id: number, rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(id, rowIndex), {
      msg: 'Are you sure you want to cancel editing the current Code?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(id, rowIndex);
  }
};
const saveNewEntry = async () => {
  let payLoad = {
    name: name.value,
    technicalReason: technicalReason.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/bouncedReason', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    name.value = '';
    technicalReason.value = false;
    loadBouncedReason();
  }
};
const saveEdited = async () => {
  const temp = bouncedReasonTemp.value.filter(
    (item) => item.id !== editingRowId.value
  );

  const isDuplicate = temp.find(
    (item) => item.name.toLowerCase() === newSouce.name.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Duplicate Account Found',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    name: newSouce.name,
    id: editingRowId.value,
    updatedOn: new Date(),
    technicalReason: newSouce.technicalReason,
  };
  const rsp = await api.put('/bouncedReason/update', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    isEditing.value = false;
    editingRowIndex.value = null;
    loadBouncedReason();
  }
};

const saveEntry = () => {
  if (name.value) {
    saveNewEntry();
  } else {
    error.value = true;
  }
};

const changeActive = async (id: number, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(id, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to deactivate ?',
    });
  } else {
    return;
  }
};

const changeActiveConfirm = async (id: number, state: boolean) => {
  const payLoad = {
    id: id,
  };

  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/bouncedReason/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadBouncedReason();
}; */

const loadBouncedReason = async () => {
  fetchingData.value = true;
  const rsp = await api.get('bouncedReason');

  if (rsp.data) {
    bouncedReason.value = rsp.data;
  }
  fetchingData.value = false;
};

onMounted(() => {
  loadBouncedReason();
});
</script>

<style scoped></style>
