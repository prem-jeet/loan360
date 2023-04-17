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
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredNatureEntry.length"
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

            <div class="row full-width q-col-gutter-y-md">
              <div class="col-xs-12 col-sm-2 col-md-2">
                <q-input
                  v-model="forwardSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="forward"
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
                  placeholder="backward"
                  @clear="backwardSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-2">
                <q-checkbox v-model="checkBox" label=" In-Active" />
              </div>
              <div class="col-xs-12 col-sm-2 col-md-3 q-pr-sm">
                <q-input
                  v-model="forward"
                  outlined
                  dense
                  no-error-icon
                  :error="error"
                  :error-message="msg"
                  placeholder="Forward"
                >
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3">
                <q-input
                  v-model="backward"
                  clearable
                  outlined
                  dense
                  hide-bottom-space
                  :error="backwardError"
                  no-error-icon
                  placeholder="Backward"
                >
                  <template v-slot:after>
                    <q-btn
                      :disable="error"
                      :icon="'add '"
                      color="teal"
                      size="md"
                      @click="saveEntry()"
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
              <q-td key="forward" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="newSouce.forward"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="newSouce.forward ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>
                  {{
                    props.row.forward.charAt(0).toUpperCase() +
                    props.row.forward.slice(1)
                  }}
                </span>
              </q-td>
              <q-td key="backward" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="newSouce.backward"
                  placeholder="Name required"
                  dense
                  outlined
                  color="green"
                  autofocus
                />
                <span v-else>
                  {{
                    props.row.backward.charAt(0).toUpperCase() +
                    props.row.backward.slice(1)
                  }}
                </span>
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
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="newSouce.forward"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="newSouce.forward ? 'green' : 'red'"
                        autofocus
                      />
                      <span v-else>
                        {{
                          props.row.forward.charAt(0).toUpperCase() +
                          props.row.forward.slice(1)
                        }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Location :</div>
                    <div class="col-12">
                      <q-input
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="newSouce.backward"
                        placeholder="Name required"
                        dense
                        outlined
                        color="green"
                        autofocus
                      />
                      <span v-else>
                        {{
                          props.row.backward.charAt(0).toUpperCase() +
                          props.row.backward.slice(1)
                        }}
                      </span>
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
                    color="green-10"
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
  },
  { path: '/module/maintenance/customerMaster/relation', label: 'Relations' },
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
const forward = ref('');
const backward = ref('');

const forwardSearchQuery = ref('');
const backwardSearchQuery = ref('');

const relations = ref<Relations[]>([]);
const relationsTemp = ref<Relations[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const backwardError = ref(false);
const msg = ref('');

const newSouce = reactive<Relations>({
  forward: '',
  id: null,
  createdOn: '',
  inactive: false,
  inactiveOn: '',
  updatedOn: '',
  backward: '',
});

const filteredNatureEntry = computed(() => {
  const _forwardSearchQuery =
    forwardSearchQuery.value?.toLocaleLowerCase() || '';
  const _backwardSearchQuery =
    backwardSearchQuery.value?.toLocaleLowerCase() || '';

  return relations.value.filter((item) => {
    const forwardPresent = item.forward
      .toLocaleLowerCase()
      .includes(_forwardSearchQuery);
    const backwardPresent = item.backward
      .toLocaleLowerCase()
      .includes(_backwardSearchQuery);

    if (_forwardSearchQuery && _backwardSearchQuery) {
      return forwardPresent && backwardPresent;
    }

    if (_forwardSearchQuery) {
      return forwardPresent;
    }

    if (_backwardSearchQuery) {
      return backwardPresent;
    }

    return true;
  });
});

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = relations.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = relations.value[index];
  }
  newSouce.forward = temp ? temp.forward : '';
  newSouce.backward = temp ? temp.backward : '';
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
    forward: forward.value,
    backward: backward.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/relation', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    forward.value = '';
    backward.value = '';
    loadSource();
  }
};
const saveEdited = async () => {
  const temp = relationsTemp.value.filter(
    (item) => item.id !== editingRowId.value
  );

  const isDuplicate = temp.find(
    (item) => item.forward.toLowerCase() === newSouce.forward.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Duplicate Account Found',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    forward: newSouce.forward,
    id: editingRowId.value,
    updatedOn: new Date(),
    backward: newSouce.backward,
  };
  const rsp = await api.put('/relation/update', payLoad);
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
  if (forward.value && backward.value) {
    saveNewEntry();
  } else if (!forward.value) {
    error.value = true;
  } else {
    backwardError.value = true;
  }
};

const changeActive = async (id: number, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(id, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to make deactivate ?',
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
  const rsp = await api.put('/relation/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  try {
    const rsp = await api.get('relation');
    if (rsp.data) {
      const transformedData = rsp.data.map(
        (item: {
          createdOn: string | number | Date;
          updatedOn: string | number | Date;
          inactiveOn: string | number | Date;
        }) => ({
          ...item,
          createdOn: item.createdOn ? new Date(item.createdOn) : '',
          updatedOn: item.updatedOn ? new Date(item.updatedOn) : '',
          inactiveOn: item.inactiveOn ? new Date(item.inactiveOn) : '',
        })
      );
      relations.value = transformedData;
      relationsTemp.value = transformedData;
    }
  } catch (error) {
    // handle error
  } finally {
    fetchingData.value = false;
  }
};

watch(forward, () => {
  error.value = false;
  msg.value = '';

  const temp = relationsTemp.value.find(
    (item) => item.forward.toLowerCase() === forward.value.toLowerCase()
  );

  if (temp) {
    error.value = true;
    msg.value = 'Item already exists!';
  }
});

watch(backward, () => {
  backwardError.value = false;
});

watch(checkBox, () => {
  relations.value = relationsTemp.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
});

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
