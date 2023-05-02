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
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredData.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Source Lead</div>
                </div>
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
                  v-model="leadName"
                  outlined
                  dense
                  no-error-icon
                  :error="error"
                  :error-message="msg"
                  placeholder="name"
                >
                  <template v-slot:prepend> Lead </template>
                  <template v-slot:after>
                    <q-btn
                      :icon="'add '"
                      color="teal"
                      size="md"
                      :disable="error"
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
              <q-td key="name" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editName"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="editName ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>{{
                  props.row.name.charAt(0).toUpperCase() +
                  props.row.name.slice(1)
                }}</span>
              </q-td>
              <q-td key="createdOn" :props="props">
                {{ formatDate(props.row.createdOn) }}
              </q-td>
              <q-td key="updatedOn" :props="props">
                {{ formatDate(props.row.updatedOn) }}
              </q-td>
              <q-td key="inactiveOn" :props="props">
                {{ formatDate(props.row.inactiveOn) }}
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
                        v-model="editName"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="editName ? 'green' : 'red'"
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
                    <div class="col-12 text-weight-medium">Created :</div>
                    <div class="col-12">
                      {{ formatDate(props.row.createdOn) }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Updated :</div>
                    <div class="col-12">
                      {{ formatDate(props.row.updatedOn) }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Inactive :</div>
                    <div class="col-12">
                      {{ date.formatDate(props.row.inactiveOn) }}
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
import { ref, onMounted, computed, watch } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { date } from 'quasar';

interface Source {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  { path: '/module/maintenance/leadMaster/source', label: 'LeadMaster' },
  { path: '/module/maintenance/leadMaster/source', label: 'Source' },
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
    label: 'Source Lead',
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

const fetchingData = ref(false);
const leadName = ref('');
const nameSearchQuery = ref('');
const source = ref<Source[]>([]);
const sourceTemp = ref<Source[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const msg = ref('');
const editName = ref('');

const filteredData = computed(() => {
  return source.value.filter((item) => {
    return item.name
      .toLowerCase()
      .includes(nameSearchQuery.value.toLowerCase());
  });
});

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = source.value.findIndex((obj) => obj.id === editingRowId.value);
    temp = source.value[index];
  }
  editName.value = temp ? temp.name : '';
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
const saveNewEntry = async () => {
  let payLoad = {
    name: leadName.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/sourceLead', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    leadName.value = '';
    loadSource();
  }
};
const saveEdited = async () => {
  const temp = sourceTemp.value.filter(
    (item) => item.id !== editingRowId.value
  );

  const isDuplicate = temp.find(
    (item) => item.name.toLowerCase() === editName.value.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Item already exist',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    name: editName.value,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/sourceLead/update', payLoad);
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
  if (leadName.value) {
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
  const rsp = await api.put('/sourceLead/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('sourceLead');

  if (rsp.data) {
    const transformedData = rsp.data.map(
      (item: { createdOn: string; updatedOn: string; inactiveOn: string }) => {
        return {
          ...item,
          createdOn: item.createdOn !== null ? new Date(item.createdOn) : '',
          updatedOn: item.updatedOn !== null ? new Date(item.updatedOn) : '',
          inactiveOn: item.inactiveOn !== null ? new Date(item.inactiveOn) : '',
        };
      }
    );
    sourceTemp.value = transformedData;

    source.value = transformedData.filter((item: { inactive: boolean }) => {
      return item.inactive === checkBox.value;
    });
  }
  fetchingData.value = false;
};

watch(leadName, () => {
  error.value = false;
  msg.value = '';
  editingRowIndex.value = null;
  isEditing.value = false;

  if (!leadName.value) {
    return;
  }

  const temp = sourceTemp.value.find(
    (item) => item.name.toLowerCase() === leadName.value.toLocaleLowerCase()
  );

  if (temp) {
    error.value = true;
    msg.value = 'Item already exists!';
  }
});

watch(checkBox, () => {
  editingRowIndex.value = null;
  isEditing.value = false;
  source.value = sourceTemp.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
});

watch(nameSearchQuery, () => {
  editingRowIndex.value = null;
  isEditing.value = false;
});

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
