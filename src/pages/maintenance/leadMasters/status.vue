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
            status.length
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
                  <div class="col-auto text-h6">Status Lead</div>
                  <div class="col-auto">
                    <q-btn
                      color="blue-7"
                      icon="add"
                      label="Add status"
                      size="md"
                      @click="newEntry()"
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
                    @clear="nameSearchQuery = ''"
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
                  <q-btn
                    icon="edit"
                    size="xs"
                    outline
                    color="accent"
                    @click="editEntry(props.row.id)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'active' : 'In-active '"
                    size="xs"
                    outline
                    color="red"
                    @click="changeActive(props.row.id, props.row.inactive)"
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
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      {{ props.row.name }}
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

                <q-card-actions align="right" class="q-py-md bg-grey-2">
                  <q-btn-group push unelevated>
                    <q-btn
                      icon="edit"
                      size="xs"
                      outline
                      color="accent"
                      @click="editEntry(props.row.id)"
                    >
                      <q-tooltip>Edit</q-tooltip>
                    </q-btn>
                    <q-btn
                      :label="props.row.inactive ? 'active' : 'In-active '"
                      size="xs"
                      outline
                      color="red"
                      @click="changeActive(props.row.id, props.row.inactive)"
                    >
                    </q-btn>
                  </q-btn-group>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="isEntryModalActive">
    <q-card>
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl">{{
              mode === 'new' ? 'Add status' : 'Edit status'
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
                <q-input
                  v-model="newStatus.name"
                  label="Name"
                  hide-bottom-space
                  outlined
                  :rules="[(val) => !!val || '']"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="right" class="q-py-md bg-grey-2">
          <q-btn
            :label="editingRowId === null ? 'Add' : 'Save '"
            :icon="editingRowId === null ? 'add' : 'save '"
            color="teal"
            type="submit"
          />
          <q-btn label="Reset" color="red-5" type="reset" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { onSuccess, confirmDialog } from 'src/utils/notification';

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  { path: '/module/maintenance/source', label: 'Status' },
];

interface Status {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
}

const fetchingData = ref(false);
const nameSearchQuery = ref('');
const status = ref<Status[]>([]);
const statusTemp = ref<Status[]>([]);
const checkBox = ref(false);
const isEntryModalActive = ref(false);
const editingRowId = ref<number | null>(null);
let mode: 'new' | 'edit' = 'new';

const newStatus = reactive<Status>({
  name: '',
  id: null,
  createdOn: '',
  inactive: false,
  inactiveOn: '',
  updatedOn: '',
});

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
  return status.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
});

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = status.value.findIndex((obj) => obj.id === editingRowId.value);
    temp = status.value[index];
  }
  newStatus.name = temp ? temp.name : '';
};

const newEntry = () => {
  mode = 'new';
  editingRowId.value = null;
  isEntryModalActive.value = true;

  setFormData();
};
const editEntry = (id: number) => {
  mode = 'edit';
  editingRowId.value = id;
  isEntryModalActive.value = true;
  setFormData();
};
const saveNewEntry = async () => {
  let payLoad = {
    name: newStatus.name,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/sourceLead', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });

    loadSource();
    isEntryModalActive.value = false;
  }
};
const saveEdited = async () => {
  let payLoad = {
    name: newStatus.name,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/sourceLead/update', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadSource();
    isEntryModalActive.value = false;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveNewEntry() : saveEdited();
};
watch(nameSearchQuery, () => {
  status.value = statusTemp.value.filter((item) => {
    return item.name
      .toLowerCase()
      .includes(nameSearchQuery.value.toLowerCase());
  });
});

const changeActive = async (id: number, state: boolean) => {
  confirmDialog(() => changeActiveConfirm(id, state), {
    msg: state
      ? 'Are you sure you want to make active ?'
      : 'Are you sure you want to make inactive ?',
  });
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
  const rsp = await api.get('statusLead');

  if (rsp.data) {
    status.value = rsp.data.map(
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
    statusTemp.value = status.value;
  }
  fetchingData.value = false;
};
onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
