<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredData"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredData.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Bounced Reason</div>
                </div>
              </div>
            </div>

            <div class="row full-width q-mt-sm">
              <div class="col-xs-12 col-sm-3 col-md-3 q-pb-sm">
                <q-input
                  v-model="nameSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="search"
                  @clear="nameSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-3 q-pb-sm">
                <q-checkbox v-model="checkBox" label=" In-Active" />
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
                  <q-btn icon="edit" size="xs" outline color="accent" />
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
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
                  <q-btn label="edit" icon="edit" size="sm" color="teal" />

                  <q-btn
                    :label="`${props.row.inactive ? '' : 'de-'}activate`"
                    size="sm"
                    color="red"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from 'src/types/Common';
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { capitalCase } from 'src/utils/string';

interface BouncedReason {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  technicalReason: boolean;
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
const fetchingData = ref(false);
const name = ref('');
const technicalReason = ref(false);
const nameSearchQuery = ref('');
const bouncedReason = ref<BouncedReason[]>([]);
const bouncedReasonTemp = ref<BouncedReason[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const msg = ref('');

const newSouce = reactive<BouncedReason>({
  name: '',
  id: null,
  createdOn: '',
  inactive: false,
  inactiveOn: '',
  updatedOn: '',
  technicalReason: false,
});

const filteredData = computed(() =>
  bouncedReason.value.filter((item) => item.inactive === checkBox.value)
);

const setFormData = () => {
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
    loadSource();
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
    loadSource();
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
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('bouncedReason');

  if (rsp.data) {
    bouncedReason.value = rsp.data;
    bouncedReason.value = bouncedReason.value.reverse();
    bouncedReasonTemp.value = bouncedReason.value;
  }
  fetchingData.value = false;
};

watch(name, () => {
  error.value = false;
  msg.value = '';

  if (!name.value) {
    return;
  }

  const temp = bouncedReasonTemp.value.find(
    (item) => item.name.toLowerCase() === name.value.toLocaleLowerCase()
  );

  if (temp) {
    error.value = true;
    msg.value = 'Item already exists!';
  }
});

watch(nameSearchQuery, () => {
  bouncedReason.value = bouncedReasonTemp.value.filter((item) => {
    return item.name
      .toLowerCase()
      .includes(nameSearchQuery.value.toLowerCase());
  });
});

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
