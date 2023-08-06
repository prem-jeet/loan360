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
            <div
              class="row full-width items-center q-gutter-x-md q-gutter-y-sm"
            >
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
                  />
                </div>
              </div>
            </div>

            <div class="row full-width q-mt-md q-mb-md items-center">
              <div class="col-12 col-sm-8 col-md-4">
                <q-input
                  v-model="filter.name"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Search Name"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 q-mt-sm q-mt-sm-none col-sm-auto q-ml-md-md">
                <div class="flex justify-end">
                  <q-checkbox v-model="filter.inActive" label=" In-Active" />
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
                  <q-btn icon="edit" size="xs" outline color="accent" />

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    :label="`${props.row.inactive ? '' : 'De-'}Activate`"
                    size="xs"
                    outline
                    color="red"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="name" :props="props">
                {{ firstLetterCpitalze(props.row.name) }}
              </q-td>

              <q-td key="location" :props="props">
                {{ firstLetterCpitalze(props.row.location) }}
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
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      {{ firstLetterCpitalze(props.row.name) }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Location :</div>
                    <div class="col-12">
                      {{ firstLetterCpitalze(props.row.location) }}
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
                  <q-btn label="edit" icon="edit" size="sm" color="teal" />

                  <q-btn
                    :label="`${props.row.inactive ? '' : 'De-'}Activate`"
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
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';

interface Stations {
  name: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  location: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/customerMaster/station',
    label: 'Customer Master',
  },
  {
    path: '/module/maintenance/customerMaster/station',
    label: 'Station',
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
    label: 'Name',
  },
  {
    name: 'location',
    required: true,
    align: 'left',
    field: 'location',
    label: 'Location',
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

interface Filter {
  name: string | null;
  inActive: boolean;
}
const filter = reactive<Filter>({ inActive: false, name: null });
const $q = useQuasar();
const fetchingData = ref(false);
const name = ref('');
const location = ref('');
const nameSearchQuery = ref('');
const stations = ref<Stations[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const editName = ref('');
const editLocation = ref('');
const format = 'DD/MM/YYYY @hh:mmA';

const filteredData = computed(() =>
  stations.value.filter(
    (item) =>
      item.name.toLowerCase().includes(nameSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value
  )
);

const isDuplicate = computed(
  () =>
    !!stations.value.find(
      (item) => item.name.toLocaleLowerCase() === name.value
    )
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = stations.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = stations.value[index];
  }
  editName.value = temp ? temp.name : '';
  editLocation.value = temp ? temp.location : '';
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
  const temp = stations.value.filter((item) => item.id !== editingRowId.value);

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
    location: editLocation.value,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/station/update', payLoad);
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
    name: name.value,
    inactive: false,
    createdOn: new Date(),
    location: location.value,
  };
  const rsp = await api.post('/station', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    name.value = '';
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
  const rsp = await api.put('/station/' + str, {
    id,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('station');

  if (rsp.data) {
    stations.value = rsp.data;
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
