<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="stations"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :rows-per-page-options="[0]"
          :hide-bottom="!!stations.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div
              class="row full-width items-center q-gutter-x-md q-gutter-y-sm"
            >
              <div class="col-auto">
                <span class="text-h6">Station</span>
              </div>
              <div class="col-auto">
                <div class="col-auto">
                  <q-btn
                    color="blue-7"
                    icon="add"
                    label="Add new"
                    size="md"
                    class="full-width"
                    @click="(isStationFormActive = true), (editingRowId = null)"
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
                  <q-btn
                    icon="edit"
                    size="xs"
                    outline
                    color="accent"
                    @click="
                      (isStationFormActive = true),
                        (editingRowId = props.row.id)
                    "
                  />

                  <q-btn
                    :label="`${props.row.inactive ? '' : 'De-'}Activate`"
                    size="xs"
                    outline
                    color="red"
                  />
                </q-btn-group>
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name && firstLetterCpitalze(props.row.name) }}
              </q-td>

              <q-td key="location" :props="props">
                {{
                  props.row.location && firstLetterCpitalze(props.row.location)
                }}
              </q-td>

              <q-td
                :props="props"
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                :key="key"
              >
                {{ formatDate(props.row[key], dateFormat) }}
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
                        {{ formatDate(props.row[key], dateFormat) }}
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
                    @click="
                      (isStationFormActive = true),
                        (editingRowId = props.row.id)
                    "
                  />

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

    <q-dialog
      v-model="isStationFormActive"
      @before-hide="editingRowId = null"
      @before-show="setInitialFormData"
    >
      <q-card :style="{ minWidth: 'calc(250px + 20vw)' }" class="column">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ `${editingRowId ? 'Edit' : 'New'} Station` }}
          </div>
          <q-space />
          <q-btn
            @click="isStationFormActive = false"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
        <q-form
          class="col-grow column"
          @submit.prevent="handleFormsubmit"
          @reset="setInitialFormData"
        >
          <q-card-section
            class="q-pa-md col-grow column justify-evenly"
            :style="{ minHeight: '40vh' }"
          >
            <q-input
              v-model="stationFormData.name"
              outlined
              no-error-icon
              :rules="[(val) => !!val]"
              :error="!stationFormData.name"
              hide-bottom-space
              label="Name"
              @update:model-value="
                (val) => {
                  if (val && typeof val === 'string') {
                    stationFormData.name = capitalCase(val);
                  }
                }
              "
            />
            <q-input
              v-model="stationFormData.location"
              outlined
              no-error-icon
              hide-bottom-space
              label="Location"
              @update:model-value="
                (val) => {
                  if (val && typeof val === 'string') {
                    stationFormData.location = capitalCase(val);
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
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
import { TableColumn } from 'src/types/Common';
import { useFetch, usePost, usePut } from 'src/composables/apiCalls';
import { alertDialog } from 'src/utils/notification';

interface Stations {
  id: number;
  name: string;
  location: string | null;
  inactive: boolean;
  createdOn: string | null;
  inactiveOn: string | null;
  updatedOn: string | null;
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
interface Form {
  name: string | null;
  location: string | null;
}
const stationFormData = ref<Form>({
  name: null,
  location: null,
});

const filter = reactive<Filter>({ inActive: false, name: null });
const $q = useQuasar();
const fetchingData = ref(false);

const stations = ref<Stations[]>([]);
const editingRowId = ref<number | null>(null);

const dateFormat = 'DD/MM/YYYY @hh:mmA';
const isStationFormActive = ref(false);

const initialFormData = computed(() => {
  const temp: Form = {
    location: null,
    name: null,
  };

  if (editingRowId.value) {
    const editingRow = stations.value.find(
      ({ id }) => id === editingRowId.value
    );
    if (editingRow) {
      temp.name = capitalCase(editingRow.name);
      temp.location = editingRow.location
        ? location && capitalCase(editingRow.location)
        : null;
    }
  }
  return temp;
});

const setInitialFormData = () =>
  (stationFormData.value = { ...initialFormData.value });

const isStationNameDuplicate = (name: string) => {
  const matchedStation = stations.value.find(
    (station) => station.name.toLowerCase() === name.toLowerCase()
  );
  return matchedStation && editingRowId.value
    ? matchedStation?.id !== editingRowId.value
    : !!matchedStation;
};

const handleFormsubmit = async () => {
  if (isStationNameDuplicate(stationFormData.value.name!)) {
    alertDialog('Duplicate Station Name');
    return;
  }

  const currentDataStr = new Date().toISOString();

  const payload: Partial<Stations> = {
    name: stationFormData.value.name!,
    location: stationFormData.value.location,
  };

  const editingRow = stations.value.find(({ id }) => id === editingRowId.value);

  if (!editingRowId.value) {
    payload.createdOn = currentDataStr;
    payload.inactive = false;
  } else if (editingRow) {
    payload.id = editingRow.id;
  }
  let rsp;
  if (editingRowId.value) {
    rsp = await usePut('/station/update', payload, 'Unable to edit Station.');
  } else {
    rsp = await usePost('/station', payload, 'Unable to create Station.');
  }
  {
    if (rsp) {
      const newStation: Stations = {
        id: editingRow ? editingRow.id : rsp.id!,
        name: payload.name!,
        location: payload.location!,
        inactive: editingRow ? editingRow.inactive : false,
        createdOn: editingRow ? editingRow.createdOn : currentDataStr,
        updatedOn: editingRow ? currentDataStr : null,
        inactiveOn: editingRow ? editingRow.inactiveOn : null,
      };
      stations.value = !editingRow
        ? [...stations.value, { ...newStation }]
        : stations.value.map((station) =>
            station.id === editingRow.id ? newStation : station
          );
      isStationFormActive.value = false;
    }
  }
};

/* const setFormData = () => {
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

 const isDuplicate = computed(
  () =>
    !!stations.value.find(
      (item) => item.name.toLocaleLowerCase() === name.value
    )
);

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
    fetchStation();
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
    fetchStation();
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
    fetchStation();
  }
};
*/

const fetchStation = async () => {
  fetchingData.value = true;
  const rsp = await useFetch('station');

  if (rsp) {
    stations.value = rsp as Stations[];
  }
  fetchingData.value = false;
};

onMounted(() => {
  fetchStation();
});
</script>

<style scoped></style>
