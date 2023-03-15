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
          :no-data-label="'No result found'"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredNatureEntry.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12 text-h4">Nature entry</div>
              <div class="col-12">
                <q-input
                  v-model="searchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Search code"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
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
                    v-if="!isEditing || editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    size="xs"
                    outline
                    color="red"
                    v-if="!isEditing || editingRowIndex !== props.rowIndex"
                    @click="() => deleteEntry(props.rowIndex)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="isEditing && editingRowIndex === props.rowIndex"
                    @click="() => saveEdited(props.rowIndex)"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="isEditing && editingRowIndex === props.rowIndex"
                    @click="isEditing = false"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="code" :props="props">
                <span>{{ props.row.code }}</span>
              </q-td>
              <q-td key="name" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="editingData.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="props.row.name ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>{{ props.row.name }}</span>
              </q-td>
              <q-td
                key="section"
                :props="props"
                auto-width
                style="min-width: 300px"
              >
                <q-select
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  dense
                  outlined
                  v-model="editingData.section"
                  :options="sectionSelectOptions"
                />
                <span v-else>{{
                  sectionSelectOptions.find(
                    (item) => item.value === props.row.section
                  )!.label
                }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { confirmDialog, onSuccess } from 'src/utils/notification';
import { ref, reactive, computed, watch, onMounted } from 'vue';

interface NatureEntry {
  code: string;
  name: string;
  section: 'D' | 'L' | 'A';
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '/module/settings/natureEntry', label: 'Loan master' },
];

const sectionSelectOptions: { value: 'A' | 'L' | 'D'; label: string }[] = [
  { value: 'A', label: 'Account' },
  { value: 'L', label: 'Loan' },
  { value: 'D', label: 'Deposit' },
];

const fetchingData = ref(false);
const natureEntry = ref<NatureEntry[]>([]);
const searchQuery = ref<string | null>('');
const filteredNatureEntry = computed(() => {
  if (!searchQuery.value) {
    return natureEntry.value;
  }

  return natureEntry.value.filter((entry) => {
    console.log(entry.code === searchQuery.value);

    entry.code === searchQuery.value;
  });
});
const isEditing = ref(false);
const editingRowIndex = ref(0);
const editingData = reactive<{
  name: string;
  section: { value: 'A' | 'D' | 'L'; label: string };
}>({
  name: '',
  section: { value: 'A', label: 'Accounts' },
});

const columns = reactive<
  {
    name: string;
    required?: boolean;
    label: string;
    field: string;
    align: 'left';
  }[]
>([
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
    name: 'section',
    required: true,
    align: 'left',
    field: 'section',
    label: 'Section',
  },
]);

const editEntry = (rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(
      () => editEntryConfirmed(natureEntry.value[rowIndex], rowIndex),
      {
        msg: 'Are you sure you want to cancel editing the current Code?',
      }
    );
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(natureEntry.value[rowIndex], rowIndex);
  }
};

const editEntryConfirmed = (row: NatureEntry, index: number) => {
  editingRowIndex.value = index;

  editingData.name = row.name;
  editingData.section = sectionSelectOptions.find(
    (item) => item.value === row.section
  ) as { value: 'A' | 'L' | 'D'; label: string };
};

const saveEdited = async (rowIndex: number) => {
  if (!editingData.name) {
    return;
  }
  const rsp = await api.put('natureEntry', {
    code: natureEntry.value[rowIndex].code,
    name: editingData.name,
    section: editingData.section.value,
  });

  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'sync_alt' });
    natureEntry.value[rowIndex].name = editingData.name;
    natureEntry.value[rowIndex].section = editingData.section.value;
    isEditing.value = false;
  }
};

const deleteEntry = (rowIndex: number) => {
  confirmDialog(() => deleteEntryConfirmed(rowIndex), {});
};

const deleteEntryConfirmed = (rowIndex: number) => {
  /* todo */
  console.log('delete called');
};

watch(searchQuery, () => {
  if (searchQuery.value) {
    searchQuery.value = searchQuery.value.trim().toUpperCase();
  }
});

onMounted(async () => {
  const rsp = await api.get('natureEntry');

  if (rsp.data) {
    natureEntry.value = rsp.data;
  }
});
</script>

<style scoped></style>
