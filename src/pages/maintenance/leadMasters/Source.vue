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

          <div
            class="col-12 q-mt-md col-sm-auto q-mt-sm-none q-ml-sm-md"
            style="font-size: min(20px, calc(3.5vw))"
          >
            <q-checkbox v-model="filter.inactive" label="In-Active" />
          </div>
        </div>
      </TablePageFilterLayout>
    </div>
    <div class="q-mt-lg q-pb-xl q-mb-lg">
      <CommonTable
        :fetching-data="fetchingData"
        :rows="filteredSource"
        :columns="columns"
        @edit="
          (row) => {
            editingRowId = row.id;
            formData.name = row.name;
            isSourceFormActive = true;
          }
        "
        @toggle-active-state="toggleActiveState"
      />
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
import Header from 'src/components/table/TablePageHeader.vue';
import CommonTable from 'src/components/table/CommonTable.vue';
import TablePageFilterLayout from 'src/layouts/TablePageFilterLayout.vue';
import AddEditForm from 'src/components/commonForms/AddEditForm.vue';

import { ref, onMounted, computed, reactive } from 'vue';

import { alertDialog, asyncConfirmDialog } from 'src/utils/notification';
import { useScreenSize } from 'src/composables/utilComposibles';
import { useFetch, usePost, usePut } from 'src/composables/apiCalls';
import { TableColumn } from 'src/types/Common';

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
    name: 'name',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Source Lead',
  },
  {
    name: 'inactive',
    required: true,
    align: 'center',
    field: 'inactive',
    label: 'In-Active',
  },
  {
    name: 'createdOn',
    required: true,
    align: 'center',
    field: 'createdOn',
    label: 'Created On',
  },
  {
    name: 'updatedOn',
    required: true,
    align: 'center',
    field: 'updatedOn',
    label: 'Updated On',
  },
  {
    name: 'inactiveOn',
    required: true,
    align: 'center',
    field: 'inactiveOn',
    label: 'In-Active On',
  },
];

const { screenWidth } = useScreenSize();

const source = ref<Source[]>([]);
const editingRowId = ref<number | null>(null);

const formData = ref<Form>({
  name: null,
});

const fetchingData = ref(false);
const isSourceFormActive = ref(false);
const isFilterExpanded = ref(true);

const filter = reactive<Filter>({ name: null, inactive: false });

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
