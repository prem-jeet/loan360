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
                  <div class="col-auto text-h6">Relations</div>
                </div>
              </div>
            </div>

            <div class="row full-width q-col-gutter-y-md q-pb-md">
              <div class="col-xs-12 col-sm-2 col-md-2 q-pr-xs">
                <q-input
                  v-model="forwardSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="search forward"
                  @clear="forwardSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-2 col-md-2 q-pl-xs">
                <q-input
                  v-model="backwardSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="search backward"
                  @clear="backwardSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-2">
                <q-checkbox
                  v-model="checkBox"
                  label=" In-Active"
                  @click="(editingRowIndex = null), (isEditing = false)"
                />
              </div>

              <div
                v-if="$q.screen.width > 600"
                class="col-xs-12 col-sm-2 col-md-3 q-pr-sm"
              >
                <q-input
                  v-model="forward"
                  outlined
                  dense
                  clearable
                  no-error-icon
                  error-message="Item alredy exits"
                  placeholder="forward"
                  @clear="forward = ''"
                >
                </q-input>
              </div>

              <div
                v-if="$q.screen.width > 600"
                class="col-xs-12 col-sm-3 col-md-3 q-pr-sm"
              >
                <q-input
                  v-model="backward"
                  clearable
                  outlined
                  dense
                  hide-bottom-space
                  no-error-icon
                  placeholder="backward"
                  @clear="backward = ''"
                >
                  <template v-slot:after>
                    <q-btn
                      icon="add"
                      color="teal"
                      size="md"
                      :disable="forward === '' || backward === ''"
                      @click="saveEntry"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <q-card v-if="$q.screen.width < 600" class="q-pa-lg">
              <div class="row full-width q-col-gutter-y-md">
                <div class="col-xs-12">
                  <q-input
                    v-model="forward"
                    outlined
                    dense
                    clearable
                    no-error-icon
                    error-message="Item alredy exits"
                    placeholder="forward"
                    @clear="forward = ''"
                  >
                  </q-input>
                </div>

                <div class="col-xs-12">
                  <q-input
                    v-model="backward"
                    clearable
                    outlined
                    dense
                    hide-bottom-space
                    no-error-icon
                    placeholder="backward"
                    @clear="backward = ''"
                  >
                  </q-input>
                </div>
                <div class="col-xs-12 text-center">
                  <q-btn
                    icon="add"
                    color="teal"
                    size="md"
                    padding="7px 25px"
                    :disable="forward === '' || backward === ''"
                    @click="saveEntry"
                  />
                </div>
              </div>
            </q-card>
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
              <q-td key="forward" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editForward"
                  placeholder="forward required"
                  dense
                  outlined
                  :color="editForward ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>
                  {{ firstLetterCpitalze(props.row.forward) }}
                </span>
              </q-td>

              <q-td key="backward" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editBackward"
                  placeholder="backward required"
                  dense
                  outlined
                  color="green"
                  autofocus
                />
                <span v-else>
                  {{ firstLetterCpitalze(props.row.backward) }}
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
                    <div class="col-12 text-weight-medium">Forward :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="editForward"
                        placeholder="Forward required"
                        dense
                        outlined
                        :color="editForward ? 'green' : 'red'"
                        autofocus
                      />
                      <span v-else>
                        {{ firstLetterCpitalze(props.row.forward) }}
                      </span>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Backward :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="editBackward"
                        placeholder="Name required"
                        dense
                        outlined
                        color="green"
                        autofocus
                      />
                      <span v-else>
                        {{ firstLetterCpitalze(props.row.backward) }}
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
import { onSuccess, confirmDialog } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';

interface Relations {
  forward: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  backward: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/customerMaster/relation',
    label: 'Customer Master',
    disable: true,
  },
  {
    path: '/module/maintenance/customerMaster/relation',
    label: 'Relations',
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
    name: 'forward',
    required: true,
    align: 'left',
    field: 'forward',
    label: 'Forward',
  },
  {
    name: 'backward',
    required: true,
    align: 'left',
    field: 'backward',
    label: 'Backward',
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
const forward = ref('');
const backward = ref('');
const forwardSearchQuery = ref('');
const backwardSearchQuery = ref('');
const relations = ref<Relations[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const editForward = ref('');
const editBackward = ref('');
const format = 'DD/MM/YYYY @hh:mmA';

const filteredData = computed(() =>
  relations.value.filter(
    (item) =>
      item.forward
        .toLowerCase()
        .includes(forwardSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value &&
      item.backward
        .toLowerCase()
        .includes(backwardSearchQuery.value.toLowerCase())
  )
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = relations.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = relations.value[index];
  }
  editForward.value = temp ? temp.forward : '';
  editBackward.value = temp ? temp.backward : '';
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
  let payLoad = {
    forward: editForward.value,
    backward: editBackward.value,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/relation/update', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadSource();
  }
};

const saveEntry = async () => {
  let payLoad = {
    forward: forward.value,
    backward: backward.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/relation', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    forward.value = '';
    backward.value = '';
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
  const rsp = await api.put('/relation/' + str, {
    id,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('relation');

  if (rsp.data) {
    relations.value = rsp.data;
  }
  fetchingData.value = false;
};

watch(filteredData, () => {
  editingRowIndex.value = null;
  isEditing.value = false;
});

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
