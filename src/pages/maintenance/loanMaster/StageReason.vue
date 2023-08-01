<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredStageReason"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          :no-data-label="
            stageReason.length ? 'No data available' : 'select stage'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredStageReason.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row full-width q-gutter-x-md q-gutter-y-sm">
              <div class="col-auto">
                <span class="text-h6">Stage Reason</span>
              </div>
              <div class="col-auto">
                <div class="col-auto">
                  <q-btn
                    color="blue-7"
                    icon="add"
                    label="Add new"
                    size="md"
                    class="full-width"
                    @click="isStageReasonFormActive = true"
                    :disable="!selectedStageCode"
                  />
                </div>
              </div>
            </div>

            <div class="row full-width q-mt-md">
              <div class="col-12 col-sm-8 col-md-5">
                <q-select
                  v-model="selectedStageCode"
                  :options="(inactiveFilter(stageCodeOptions) as Stage[])"
                  map-options
                  emit-value
                  option-label="name"
                  option-value="code"
                  :label="
                    stageCodeOptions.length
                      ? `${!selectedStageCode ? 'Select ' : ''}Stage`
                      : 'No options available'
                  "
                  outlined
                  hide-bottom-space
                  clearable
                  clear-icon="backspace"
                  dropdown-icon="expand_more"
                  behavior="menu"
                  options-dense
                  no-error-icon
                  :error="!selectedStageCode"
                  :disable="!stageCodeOptions.length"
                />
              </div>
            </div>

            <div class="row full-width q-mt-md q-mb-md items-center">
              <div class="col-12 col-sm-8 col-md-4">
                <q-input
                  v-model="filter.reason"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Search Reason"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 q-mt-sm q-mt-sm-none col-sm-auto q-ml-md-md">
                <q-checkbox v-model="filter.inActive" label=" In-Active" />
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
                      isStageReasonFormActive = true;
                    "
                  />
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'de-activate'"
                    size="xs"
                    outline
                    color="red"
                    @click="() => toggleActiveState(props.row)"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="reason" :props="props">
                {{ firstLetterCpitalze(props.row.reason) }}
              </q-td>

              <q-td
                :props="props"
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                :key="key"
              >
                {{ formatDate(props.row[key], format) }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="q-pb-none">
                  <div class="text-weight-medium">
                    {{ props.colsMap.reason.label }}
                  </div>
                  <div>
                    {{ capitalCase(props.row.reason) }}
                  </div>
                </q-card-section>
                <template
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                  :key="key"
                >
                  <q-card-section class="q-pb-none" v-if="props.row[key]">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{ formatDate(props.row[key], format) }}
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
                      isStageReasonFormActive = true;
                    "
                  />
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'de-activate'"
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
      v-model="isStageReasonFormActive"
      @before-hide="editingRowId = null"
      @before-show="setInitialFormData"
    >
      <q-card :style="{ minWidth: 'calc(250px + 30vw)' }" class="column">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ `${editingRowId ? 'Edit' : 'New'} Stage Reason` }}
          </div>
          <q-space />
          <q-btn
            @click="isStageReasonFormActive = false"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-form
          @submit.prevent="handleFormsubmit"
          @reset="setInitialFormData"
          class="col-grow column"
        >
          <q-card-section
            class="q-pa-md col-grow column justify-evenly"
            :style="{ minHeight: '40vh' }"
          >
            <q-select
              v-model="formData.stageCode"
              :options="(inactiveFilter(stageCodeOptions) as Stage[])"
              map-options
              emit-value
              option-label="name"
              option-value="code"
              :label="stageCodeOptions.length ? 'Stag' : 'No options available'"
              outlined
              hide-bottom-space
              dropdown-icon="expand_more"
              behavior="menu"
              options-dense
              no-error-icon
              :rules="[(val) => !!val]"
              :error="!formData.stageCode"
              disable
            />
            <q-input
              v-model="formData.reason"
              outlined
              no-error-icon
              :rules="[(val) => !!val]"
              :error="!formData.reason"
              hide-bottom-space
              label="Reason"
              @update:model-value="
                (val) => {
                  if (val && typeof val === 'string') {
                    formData.reason = capitalCase(val);
                  }
                }
              "
            />
          </q-card-section>
          <q-card-actions align="center" class="q-py-md bg-grey-2">
            <q-btn
              color="teal"
              type="submit"
              :label="editingRowId === null ? 'Add' : 'Save '"
              :icon="editingRowId === null ? 'add' : 'save '"
            />
            <q-btn label="Reset" color="red-5" type="reset" icon="refresh" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { alertDialog, asyncConfirmDialog } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
import { useFetch, usePut } from 'src/composables/apiCalls';
import { inactiveFilter } from 'src/utils/filters';

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/stageReason',
    label: 'Loan Master',
  },
  {
    path: '/module/maintenance/loanMaster/stageReason',
    label: 'Stage Reason',
  },
];

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
    name: 'reason',
    required: true,
    align: 'left',
    field: 'reason',
    label: 'Reason',
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

interface StageReason {
  reason: string;
  stageCode: string | null;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
}

interface Stage {
  code: string;
  name: string;
  inactive: boolean;
}

interface Filter {
  reason: string | null;
  inActive: boolean;
}

interface Form {
  stageCode: string | null;
  reason: string | null;
}

const filter = reactive<Filter>({ inActive: false, reason: null });

const isStageReasonFormActive = ref(false);
const $q = useQuasar();
const fetchingData = ref(false);
const selectedStageCode = ref('');
const stageCodeOptions = ref<Stage[]>([]);
const stageReason = ref<StageReason[]>([]);
const format = 'DD/MM/YYYY @hh:mmA';
const editingRowId = ref<number | null>(null);
const formData = ref<Form>({
  reason: null,
  stageCode: null,
});

const filteredStageReason = computed(() => {
  const stageCode = selectedStageCode.value;
  const filteredArray = stageReason.value.filter((reason) => {
    const isReasonMatched =
      !filter.reason ||
      reason.reason.toLowerCase().includes(filter.reason.toLowerCase());
    const isInactiveMatched = reason.inactive === filter.inActive;
    const isStageMatched = !stageCode || stageCode === reason.stageCode;

    return isReasonMatched && isInactiveMatched && isStageMatched;
  });
  return filteredArray;
});

const initialFormData = computed(() => {
  const temp: Form = { stageCode: selectedStageCode.value, reason: null };

  if (editingRowId.value) {
    const editingRow = stageReason.value.find(
      (reason) => reason.id === editingRowId.value
    );
    if (editingRow) {
      temp.stageCode === editingRow.stageCode;
      temp.reason = capitalCase(editingRow.reason);
    }
  }

  return temp;
});
const isStageReasonDuplicate = (reason: string) => {
  const matchedStageReason = stageReason.value.find(
    ({ reason: rsn }) => rsn.toLowerCase() === reason.toLowerCase()
  );
  return matchedStageReason && editingRowId
    ? matchedStageReason?.id !== editingRowId.value
    : !!matchedStageReason;
};

const setInitialFormData = () =>
  (formData.value = { ...initialFormData.value });

const handleFormsubmit = () => {
  if (isStageReasonDuplicate(formData.value.reason!)) {
    alertDialog('Duplicate reason.');
    return;
  }
};

/*
 const editEntryConfirmed = (id: number, index: number) => {
  editingRowIndex.value = index;
  editingRowId.value = id;
  setInitialFormData();
};

 const editEntry = (id: number, rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(id, rowIndex), {
      msg: 'Are you sure you want to cancel editing the current row?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(id, rowIndex);
  }
};
const saveEdited = async () => {
  const temp = stageReason.value.filter(
    (item) => item.id !== editingRowId.value
  );

  const isDuplicate = temp.find(
    (item) => item.reason.toLowerCase() === editReason.value.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Item already exist',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    reason: editReason.value,
    id: editingRowId.value,
    updatedOn: new Date(),
    stageCode: selectedStageCode.value,
  };
  const rsp = await api.put('/stageReason/update', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadStageReason();
  }
};

const saveEntry = () => {
  selectedStageCode.value ? saveNewEntry() : (selectedError.value = true);
};

const saveNewEntry = async () => {
  let payLoad = {
    reason: reason.value,
    inactive: false,
    createdOn: new Date(),
    stageCode: selectedStageCode.value,
  };
  const rsp = await api.post('/stageReason', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    reason.value = '';
    loadStageReason();
  }
};
 */

const toggleActiveState = async (row: StageReason) => {
  const msg = `Are you sure you want to ${row.inactive ? '' : 'De-'}Activate?`;
  const confirmed = await asyncConfirmDialog({ msg });

  if (confirmed) {
    const state = row.inactive ? 'active' : 'inactive';
    const rsp = await usePut('/stageReason/' + state, {
      id: row.id,
    });
    if (rsp) {
      loadStageReason();
    }
  }
};

const loadStageReason = async () => {
  fetchingData.value = true;
  const rsp = await api.get('stageReason/stageCode/' + selectedStageCode.value);

  if (rsp.data) {
    stageReason.value = rsp.data;
  }
  fetchingData.value = false;
};

const loadStages = async () => {
  fetchingData.value = true;
  const rsp = await useFetch('stage', 'Unable to fetch Stage Options.');

  if (rsp) {
    stageCodeOptions.value = rsp as Stage[];
  }
  fetchingData.value = false;
};

watch(selectedStageCode, () => {
  if (selectedStageCode.value) {
    loadStageReason();
  }
});

onMounted(() => {
  loadStages();
});
</script>

<style scoped></style>
