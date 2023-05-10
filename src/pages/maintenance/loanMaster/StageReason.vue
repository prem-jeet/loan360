<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

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
          :no-data-label="
            stageReason.length ? 'No data available' : 'selecte stage'
          "
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredData.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Stage Reason</div>
                </div>
              </div>
            </div>

            <div class="row full-width q-my-sm">
              <div class="col-xs-12 col-sm-4 col-md-3 q-pb-sm">
                <q-select
                  v-model="selectedSatge"
                  dense
                  :options="stages"
                  map-options
                  emit-value
                  label="Select stage"
                  outlined
                  hide-bottom-space
                  :error="selectedError"
                >
                  <template v-slot:append>
                    <q-icon
                      v-if="selectedSatge"
                      name="close"
                      @click.stop.prevent="
                        (selectedSatge = ''), (stageReason = [])
                      "
                      class="cursor-pointer"
                    />
                  </template>
                </q-select>
              </div>
            </div>

            <div class="row full-width q-mt-sm">
              <div class="col-xs-12 col-sm-4 col-md-3 q-pb-sm">
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

              <div class="col-xs-12 col-sm-3 col-md-6 q-pb-sm">
                <q-checkbox
                  v-model="checkBox"
                  label=" In-Active"
                  @click="(editingRowIndex = null), (isEditing = false)"
                />
              </div>
              <div class="col-xs-12 col-sm-5 col-md-3 q-pb-sm">
                <q-input
                  v-model="reason"
                  outlined
                  dense
                  no-error-icon
                  :error="isDuplicate"
                  error-message="Item alredy exits"
                  placeholder="Reason"
                >
                  <template v-slot:prepend> Stage </template>
                  <template v-slot:after>
                    <q-btn
                      icon="add"
                      color="teal"
                      size="md"
                      :disable="isDuplicate || reason === ''"
                      @click="saveEntry"
                    />
                  </template>
                </q-input>
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
                    v-if="editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.row.id, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
                    @click="
                      () => changeActive(props.row.id, props.row.inactive)
                    "
                  >
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="saveEdited"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="(isEditing = false), (editingRowIndex = null)"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="reason" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editReason"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="editReason ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>
                  {{ firstLetterCpitalze(props.row.reason) }}
                </span>
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
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Reason :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="editReason"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="editReason ? 'green' : 'red'"
                        autofocus
                      />
                      <span v-else>
                        {{ firstLetterCpitalze(props.row.reason) }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
                <template
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                  :key="key"
                >
                  <q-card-section v-if="props.row[key]">
                    <div class="row q-gutter-y-xs">
                      <div class="col-12 text-weight-medium">
                        {{ capitalCase(key.split('On').join(' on')) }} :
                      </div>
                      <div class="col-12">
                        {{ formatDate(props.row[key], format) }}
                      </div>
                    </div>
                  </q-card-section>
                </template>

                <q-card-actions align="center" class="q-py-md bg-grey-2">
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.row.id, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="sm"
                    color="red"
                    @click="
                      () => changeActive(props.row.id, props.row.inactive)
                    "
                  >
                  </q-btn>
                  <q-btn
                    label="save"
                    icon="save"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="saveEdited"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    label="close"
                    icon="close"
                    size="sm"
                    color="red"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="(isEditing = false), (editingRowIndex = null)"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
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
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
interface StageReason {
  reason: string;
  stageCode: number | null;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
}

interface Stage {
  label: string;
  value: string;
}

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

const $q = useQuasar();
const fetchingData = ref(false);
const reason = ref('');
const selectedSatge = ref('');
const stages = ref<Stage[]>([]);
const nameSearchQuery = ref('');
const stageReason = ref<StageReason[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const editReason = ref('');
const format = 'DD/MM/YYYY @hh:mmA';
const selectedError = ref(false);

const filteredData = computed(() =>
  stageReason.value.filter(
    (item) =>
      item.reason.toLowerCase().includes(nameSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value
  )
);

const isDuplicate = computed(
  () =>
    !!stageReason.value.find(
      (item) => item.reason.toLocaleLowerCase() === reason.value
    )
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = stageReason.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = stageReason.value[index];
  }
  editReason.value = temp ? temp.reason : '';
};

const editEntryConfirmed = (id: number, index: number) => {
  editingRowIndex.value = index;
  editingRowId.value = id;
  setFormData();
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
    stageCode: selectedSatge.value,
  };
  const rsp = await api.put('/stageReason/update', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadSource();
  }
};

const saveEntry = () => {
  selectedSatge.value ? saveNewEntry() : (selectedError.value = true);
};

const saveNewEntry = async () => {
  let payLoad = {
    reason: reason.value,
    inactive: false,
    createdOn: new Date(),
    stageCode: selectedSatge.value,
  };
  const rsp = await api.post('/stageReason', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    reason.value = '';
    loadSource();
  }
};

const changeActive = (id: number, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(id, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to deactivate ?',
    });
  }
};

const changeActiveConfirm = async (id: number, state: boolean) => {
  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/stageReason/' + str, {
    id,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('stageReason/stageCode/' + selectedSatge.value);

  if (rsp.data) {
    stageReason.value = rsp.data;
  }
  fetchingData.value = false;
};

const loadStages = async () => {
  fetchingData.value = true;
  const rsp = await api.get('stage');

  if (rsp.data) {
    stages.value = rsp.data.map((item: { code: string; name: string }) => {
      return {
        label: item.name,
        value: item.code,
      };
    });
  }
  fetchingData.value = false;
};

watch(filteredData, () => {
  editingRowIndex.value = null;
  isEditing.value = false;
});

watch(selectedSatge, () => {
  selectedError.value = false;
  if (selectedSatge.value) {
    loadSource();
  }
});

onMounted(() => {
  loadStages();
});
</script>

<style scoped></style>
