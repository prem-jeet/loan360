<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteresStations"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteresStations.length"
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
                    @click="() => toggleActiveState(props.row)"
                  />
                </q-btn-group>
              </q-td>
              <q-td
                :key="key"
                :props="props"
                v-for="key in ['name', 'location']"
              >
                {{ props.row[key] && firstLetterCpitalze(props.row[key]) }}
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
                <template v-for="key in ['name', 'location']" :key="key">
                  <q-card-section class="q-pb-none" v-if="props.row[key]">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>{{ capitalCase(props.row[key]) }}</div>
                  </q-card-section>
                </template>

                <template
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                  :key="key"
                >
                  <q-card-section v-if="props.row[key]" class="q-pb-none">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{ formatDate(props.row[key], dateFormat) }}
                    </div>
                  </q-card-section>
                </template>

                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
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
                    @click="() => toggleActiveState(props.row)"
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
import { ref, onMounted, computed, reactive } from 'vue';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
import { TableColumn } from 'src/types/Common';
import { useFetch, usePost, usePut } from 'src/composables/apiCalls';
import { alertDialog, asyncConfirmDialog } from 'src/utils/notification';

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

interface Station {
  id: number;
  name: string;
  location: string | null;
  inactive: boolean;
  createdOn: string | null;
  inactiveOn: string | null;
  updatedOn: string | null;
}

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

const stations = ref<Station[]>([]);
const editingRowId = ref<number | null>(null);

const dateFormat = 'DD/MM/YYYY @hh:mmA';
const isStationFormActive = ref(false);

const filteresStations = computed(() => {
  const filteredArray = stations.value.filter((station) => {
    const isNameMatched =
      !filter.name ||
      station.name.toLowerCase().includes(filter.name.toLowerCase());
    const isInactiveMatched = station.inactive === filter.inActive;

    return isNameMatched && isInactiveMatched;
  });
  return filteredArray;
});

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

  const payload: Partial<Station> = {
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
      const newStation: Station = {
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

const toggleActiveState = async (row: Station) => {
  const msg = `Are you sure you want to ${row.inactive ? '' : 'De-'}Activate?`;
  const confirmed = await asyncConfirmDialog({ msg });

  if (confirmed) {
    const state = row.inactive ? 'active' : 'inactive';
    const rsp = await usePut('/station/' + state, {
      id: row.id,
    });
    if (rsp) {
      row.inactive = !row.inactive;
      if (row.inactive) {
        row.inactiveOn = new Date().toISOString();
      }
    }
  }
};

const fetchStation = async () => {
  fetchingData.value = true;
  const rsp = await useFetch('station');

  if (rsp) {
    stations.value = rsp as Station[];
  }
  fetchingData.value = false;
};

onMounted(() => {
  fetchStation();
});
</script>

<style scoped></style>
