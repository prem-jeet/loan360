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
              <div class="col-xs-12 col-sm-3 col-md-3 q-pb-sm">
                <q-input
                  v-model="name"
                  outlined
                  dense
                  no-error-icon
                  :error="error"
                  :error-message="msg"
                  placeholder="Reason"
                >
                  <template v-slot:prepend> Bounced </template>
                </q-input>
              </div>
              <div
                class="col-xs-12 col-sm-2 col-md-2 q-pb-sm q-pr-xs text-center"
              >
                <q-checkbox
                  v-model="technicalReason"
                  label="Technical Reason"
                />
              </div>
              <div class="col-xs-12 col-sm-1 col-md-1 q-pb-sm">
                <q-btn
                  :icon="'add '"
                  color="teal"
                  size="md"
                  :disable="error"
                  @click="saveEntry()"
                />
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
                    @click="changeActive(props.row.id, props.row.inactive)"
                  >
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="() => saveEdited()"
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
              <q-td key="name" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="newSouce.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="newSouce.name ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>{{
                  props.row.name.charAt(0).toUpperCase() +
                  props.row.name.slice(1)
                }}</span>
              </q-td>
              <q-td key="technicalReason" :props="props">
                <q-checkbox
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="newSouce.technicalReason"
                />
                <q-checkbox
                  v-else
                  v-model="props.row.technicalReason"
                  disable
                />
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
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="newSouce.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="newSouce.name ? 'green' : 'red'"
                        autofocus
                      />
                      <span v-else>{{
                        props.row.name.charAt(0).toUpperCase() +
                        props.row.name.slice(1)
                      }}</span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-6 text-weight-medium q-pt-sm">
                      Technical Reason :
                    </div>
                    <div class="col-6">
                      <q-checkbox
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="newSouce.technicalReason"
                      />
                      <span v-else>
                        <q-checkbox v-model="props.row.technicalReason" disable
                      /></span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Created :</div>
                    <div class="col-12">
                      {{
                        props.row.createdOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Updated :</div>
                    <div class="col-12">
                      {{
                        props.row.updatedOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Inactive :</div>
                    <div class="col-12">
                      {{
                        props.row.inactiveOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>

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
                    @click="changeActive(props.row.id, props.row.inactive)"
                  >
                  </q-btn>
                  <q-btn
                    label="save"
                    icon="save"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="() => saveEdited()"
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
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';

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
    label: 'Bounced Reason',
  },
  {
    name: 'technicalReason',
    required: true,
    align: 'left',
    field: 'technicalReason',
    label: 'Technical Reason',
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
    label: 'In-Active',
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
    bouncedReason.value = rsp.data.map(
      (item: {
        createdOn: string | number | Date;
        updatedOn: string | number | Date;
        inactiveOn: string | number | Date;
      }) => {
        return {
          ...item,
          createdOn: item.createdOn !== null ? new Date(item.createdOn) : '',
          updatedOn: item.updatedOn !== null ? new Date(item.updatedOn) : '',
          inactiveOn: item.inactiveOn !== null ? new Date(item.inactiveOn) : '',
        };
      }
    );
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
