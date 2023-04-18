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
                  <div class="col-auto text-h6">CustomerCategory</div>
                </div>
              </div>
            </div>

            <div class="row full-width q-col-gutter-y-md">
              <div class="col-xs-12 col-sm-4 col-md-3">
                <q-input
                  v-model="codeSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="code"
                  @clear="codeSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-3">
                <q-checkbox v-model="checkBox" label=" In-Active" />
              </div>
              <div class="col-xs-12 col-sm-2 col-md-3 q-pr-sm">
                <q-input
                  v-model="code"
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
                  v-model="name"
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
                    @click="changeActive(props.row.code, props.row.inactive)"
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
              <q-td key="code" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="newSouce.code"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="newSouce.code ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>
                  {{
                    props.row.code.charAt(0).toUpperCase() +
                    props.row.code.slice(1)
                  }}
                </span>
              </q-td>
              <q-td key="name" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="newSouce.name"
                  placeholder="Name required"
                  dense
                  outlined
                  color="green"
                  autofocus
                />
                <span v-else>
                  {{
                    props.row.name.charAt(0).toUpperCase() +
                    props.row.name.slice(1)
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
                        v-model="newSouce.code"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="newSouce.code ? 'green' : 'red'"
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
                        v-model="newSouce.name"
                        placeholder="Name required"
                        dense
                        outlined
                        color="green"
                        autofocus
                      />
                      <span v-else>
                        {{
                          props.row.name.charAt(0).toUpperCase() +
                          props.row.name.slice(1)
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
                    @click="changeActive(props.row.code, props.row.inactive)"
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

interface CustomerCategory {
  code: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  name: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/customerMaster/customerCategory',
    label: 'Customer Master',
  },
  {
    path: '/module/maintenance/customerMaster/customerCategory',
    label: 'CustomerCategory',
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
    name: 'code',
    required: true,
    align: 'left',
    field: 'code',
    label: 'Code',
  },
  {
    name: 'name',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Name',
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
const code = ref('');
const name = ref('');

const codeSearchQuery = ref('');

const customerCategorys = ref<CustomerCategory[]>([]);
const customerCategorysTemp = ref<CustomerCategory[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const backwardError = ref(false);
const msg = ref('');

const newSouce = reactive<CustomerCategory>({
  code: '',
  id: null,
  createdOn: '',
  inactive: false,
  inactiveOn: '',
  updatedOn: '',
  name: '',
});

const filteredNatureEntry = computed(() => {
  const _codeSearchQuery = codeSearchQuery.value?.toLocaleLowerCase() || '';

  return customerCategorys.value.filter((item) => {
    const codePresent = item.code
      .toLocaleLowerCase()
      .includes(_codeSearchQuery);

    if (_codeSearchQuery) {
      return codePresent;
    }

    return true;
  });
});

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = customerCategorys.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = customerCategorys.value[index];
  }
  newSouce.code = temp ? temp.code : '';
  newSouce.name = temp ? temp.name : '';
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
    forward: code.value,
    backward: name.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/customerCategory', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    code.value = '';
    name.value = '';
    loadSource();
  }
};
const saveEdited = async () => {
  const temp = customerCategorysTemp.value.filter(
    (item) => item.id !== editingRowId.value
  );

  const isDuplicate = temp.find(
    (item) => item.code.toLowerCase() === newSouce.code.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Duplicate Account Found',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    code: newSouce.code,
    id: editingRowId.value,
    updatedOn: new Date(),
    name: newSouce.name,
  };
  const rsp = await api.put('/customerCategory/update', payLoad);
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
  if (code.value && name.value) {
    saveNewEntry();
  } else if (!code.value) {
    error.value = true;
  } else {
    backwardError.value = true;
  }
};

const changeActive = async (code: string, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(code, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to make deactivate ?',
    });
  } else {
    return;
  }
};

const changeActiveConfirm = async (code: string, state: boolean) => {
  const payLoad = {
    code: code,
  };

  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/customerCategory/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  try {
    const rsp = await api.get('customerCategory');
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
      customerCategorys.value = transformedData;
      customerCategorysTemp.value = transformedData;
    }
  } catch (error) {
    // handle error
  } finally {
    fetchingData.value = false;
  }
};

watch(code, () => {
  error.value = false;
  msg.value = '';

  const temp = customerCategorysTemp.value.find(
    (item) => item.code.toLowerCase() === code.value.toLowerCase()
  );

  if (temp) {
    error.value = true;
    msg.value = 'Item already exists!';
  }
});

watch(name, () => {
  backwardError.value = false;
});

watch(checkBox, () => {
  customerCategorys.value = customerCategorysTemp.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
});

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
