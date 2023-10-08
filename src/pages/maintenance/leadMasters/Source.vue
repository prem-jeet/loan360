<template>
  <div class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width">
    <div>
      <Header
        title="Source"
        @filter="isFilterExpanded = !isFilterExpanded"
        @add="isSourceFormActive = true"
      />
    </div>
    <div class="q-mt-lg">
      <TablePageFilterLayout v-model="isFilterExpanded">
        <div class="row items-center text-h6">
          <div class="col-12 col-sm-8 col-md-6 col-lg-4">
            <q-input
              v-model="filter.name"
              clearable
              placeholder="Search name"
              clear-icon="backspace"
              outlined
              :dense="screenWidth < 540"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-12 q-mt-md col-sm-auto q-mt-sm-none q-ml-sm-md">
            <q-checkbox v-model="filter.inactive" label="In-Active" />
          </div>
        </div>
      </TablePageFilterLayout>
    </div>
    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredSource"
          :columns="columns"
          separator="cell"
          bordered
          :loading="fetchingData"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredSource.length"
          :grid="screenWidth < 1240"
        >
          <template v-slot:header-cell="props">
            <q-th
              :props="props"
              class="text-black"
              style="font-size: 1rem; background-color: #e7f4ff"
            >
              {{ props.col.label }}
            </q-th>
          </template>

          <!-- row design for screens > 800px-->
          <template v-slot:body="props">
            <tr
              class="text-table-row"
              :class="[isDark ? 'table-row-dark' : 'table-row-light']"
            >
              <template :key="key" v-for="key in Object.keys(props.colsMap)">
                <td v-if="key === 'actions'" style="width: 10ch">
                  <div class="flex flex-center">
                    <q-btn-group push unelevated>
                      <q-btn
                        icon="edit"
                        size="xs"
                        outline
                        rounded
                        color="accent"
                        @click="
                          editingRowId = props.row.id;
                          formData.name = props.row.name;
                          isSourceFormActive = true;
                        "
                      />
                      <q-btn
                        size="xs"
                        outline
                        rounded
                        color="red-5"
                        :label="props.row.inactive ? 'Activate' : 'De-Activate'"
                        @click="() => toggleActiveState(props.row)"
                      />
                    </q-btn-group>
                  </div>
                </td>

                <template v-else>
                  <!-- if date type -->
                  <td
                    :props="props"
                    v-if="Date.parse(props.row[key])"
                    style="max-width: 15ch"
                  >
                    <div class="row">
                      <span
                        class="column items-center text-caption q-col-gutter-sm items-center col-12"
                      >
                        <div class="col-auto">
                          <span>
                            {{
                              date.formatDate(props.row[key], 'DD MMM, YYYY')
                            }}
                          </span>
                        </div>
                        <div class="col-auto">
                          <q-chip
                            size="10px"
                            icon="schedule"
                            :label="date.formatDate(props.row[key], 'h:mm A')"
                            class="q-ml-xs text-overline text-weight-light"
                            color="deep-orange-1"
                            :ripple="false"
                            :dark="false"
                          />
                        </div>
                      </span>
                    </div>
                  </td>
                  <!-- if boolean type -->
                  <td
                    v-else-if="typeof props.row[key] === 'boolean'"
                    style="width: 10ch"
                  >
                    <div class="flex flex-center">
                      <q-icon
                        size="sm"
                        :name="props.row[key] ? 'cancel' : 'check_circle'"
                        :color="
                          props.row[key]
                            ? `red-${isDark ? '5' : '10'}`
                            : `green-${isDark ? '5' : '10'}`
                        "
                      />
                    </div>
                  </td>
                  <!-- if text type -->
                  <td
                    v-else
                    :props="props"
                    style="max-width: 30ch"
                    class="text-subtitle1 text-weight-medium"
                  >
                    {{ props.row[key] && capitalCase(props.row[key]) }}
                  </td>
                </template>
              </template>
            </tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div
              class="q-pa-sm"
              :class="[screenWidth < 950 ? 'col-12' : 'col-sm-6']"
            >
              <GridCard :data="props.row" :colsMap="props.colsMap" />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>

  <q-dialog
    v-model="isSourceFormActive"
    persistent
    :maximized="screenWidth < 450"
    @before-hide="editingRowId = null"
    @before-show="formData = { ...initialFormData }"
  >
    <AddEditForm
      label="Source"
      :initial-object="initialFormData"
      @close="isSourceFormActive = false"
      @submit="handleFormsubmit"
      @reset="(data) => (formData = { ...data })"
      :is-editing="editingRowId !== null"
    >
      <div class="row">
        <div class="col-12">
          <q-input
            v-model="formData.name"
            outlined
            label="Lead name"
            no-error-icon
            :rules="[(val) => !!val]"
            :error="!formData.name"
          />
        </div>
      </div>
    </AddEditForm>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { alertDialog, asyncConfirmDialog } from 'src/utils/notification';
import AddEditForm from 'src/components/commonForms/AddEditForm.vue';
import { capitalCase } from 'src/utils/string';

import Header from 'src/components/ui/TablePageHeader.vue';
import GridCard from 'src/components/ui/TableGridCard.vue';
import TablePageFilterLayout from 'src/layouts/TablePageFilterLayout.vue';
import { useScreenSize } from 'src/composables/utilComposibles';
import { useFetch, usePost, usePut } from 'src/composables/apiCalls';
import { TableColumn } from 'src/types/Common';
import { date, useQuasar } from 'quasar';

/* const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/leadMaster/source',
    label: 'LeadMaster',
    disable: true,
  },
  {
    path: '/module/maintenance/leadMaster/source',
    label: 'Source',
  },
]; */
interface Source {
  name: string;
  id?: number;
  inactive: boolean;
  createdOn: string | null;
  inactiveOn: string | null;
  updatedOn: string | null;
}
interface Form {
  name: null | string;
}

interface Filter {
  name: string | null;
  inactive: false;
}

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
    label: 'Source Lead',
  },
  {
    name: 'inactive',
    required: true,
    align: 'left',
    field: 'inactive',
    label: 'InActive',
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
const isDark = computed(() => $q.dark.isActive);
const fetchingData = ref(false);
const nameSearchQuery = ref('');
const source = ref<Source[]>([]);
const checkBox = ref(false);
const editingRowId = ref<number | null>(null);
const isSourceFormActive = ref(false);
const isFilterExpanded = ref(true);
const { screenWidth } = useScreenSize();

const filter = reactive<Filter>({ name: null, inactive: false });
const filteredData = computed(() =>
  source.value.filter(
    (item) =>
      item.name.toLowerCase().includes(nameSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value
  )
);

const filteredSource = computed(() => {
  const filteredArray = source.value.filter((source) => {
    const isNameMatched =
      !filter.name ||
      source.name.toLowerCase().includes(filter.name.toLowerCase());
    const isInactiveMatched = source.inactive === filter.inactive;

    return isNameMatched && isInactiveMatched;
  });
  return filteredArray;
});

const formData = ref<Form>({
  name: null,
});

const initialFormData = computed(() => {
  const temp: Form = {
    name: null,
  };

  if (editingRowId.value) {
    const editingRow = source.value.find(({ id }) => id === editingRowId.value);
    if (editingRow) {
      temp.name = editingRow.name;
    }
  }
  return temp;
});

const isSourceNameDuplicate = (name: string) => {
  const matchedSource = source.value.find(
    (source) => source.name.toLowerCase() === name.toLowerCase()
  );
  return matchedSource && editingRowId.value
    ? matchedSource?.id !== editingRowId.value
    : !!matchedSource;
};

const handleFormsubmit = async () => {
  if (isSourceNameDuplicate(formData.value.name!)) {
    alertDialog('Duplicate Source Name');
    return;
  }

  const currentDataStr = new Date().toISOString();

  const payload: Partial<Source> = {
    name: formData.value.name!,
  };

  const editingRow = source.value.find(({ id }) => id === editingRowId.value);

  if (!editingRowId.value) {
    payload.createdOn = currentDataStr;
    payload.inactive = false;
  } else if (editingRow) {
    payload.id = editingRow.id;
  }
  let rsp;
  if (editingRowId.value) {
    rsp = await usePut('/sourceLead/update', payload, 'Unable to edit Source.');
  } else {
    rsp = await usePost('/sourceLead', payload, 'Unable to create Source.');
  }
  {
    if (rsp) {
      const newSource: Source = {
        id: editingRow ? editingRow.id : rsp.id!,
        name: payload.name!,
        inactive: editingRow ? editingRow.inactive : false,
        createdOn: editingRow ? editingRow.createdOn : currentDataStr,
        updatedOn: editingRow ? currentDataStr : null,
        inactiveOn: editingRow ? editingRow.inactiveOn : null,
      };
      source.value = !editingRow
        ? [...source.value, { ...newSource }]
        : source.value.map((source) =>
            source.id === editingRow.id ? newSource : source
          );
      isSourceFormActive.value = false;
    }
  }
};

const toggleActiveState = async (row: Source) => {
  const msg = `Are you sure you want to ${row.inactive ? '' : 'De-'}Activate?`;
  const confirmed = await asyncConfirmDialog({ msg });

  if (confirmed) {
    const state = row.inactive ? 'active' : 'inactive';
    const rsp = await usePut('/sourceLead/' + state, {
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

const fetchSource = async () => {
  fetchingData.value = true;

  const rsp = await useFetch('sourceLead');

  if (rsp) {
    source.value = rsp as Source[];
  }

  fetchingData.value = false;
};

onMounted(() => {
  fetchSource();
});
</script>

<style scoped></style>
