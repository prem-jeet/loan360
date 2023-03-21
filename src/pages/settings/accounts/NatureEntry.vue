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
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h4">Nature entry</div>
                  <div class="col-auto">
                    <q-btn
                      color="blue-7"
                      icon="add"
                      label="Add new"
                      size="md"
                      v-if="natureEntry.length"
                      @click="isAddNewEntryModalActive = true"
                    />
                  </div>
                </div>
              </div>
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
                  :color="editingData.name ? 'green' : 'red'"
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

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="flex items-center">
                  <span class="text-weight-bold">{{ props.key }}</span>
                  <q-space />
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
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      <template v-if="!isEditing">
                        {{ props.row.name }}
                      </template>
                      <q-input
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="editingData.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="editingData.name ? 'green' : 'red'"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Section :</div>
                    <div class="col-12">
                      <template v-if="!isEditing">
                        {{ props.row.section }}
                      </template>
                      <q-select
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        dense
                        outlined
                        v-model="editingData.section"
                        :options="sectionSelectOptions"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="isAddNewEntryModalActive">
    <q-card>
      <q-form @submit.prevent="saveNewEntry" @reset="resetNewEntryForm">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-h6 q-mr-xl">Add nature entry</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isAddNewEntryModalActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-md">
          <div class="row">
            <div class="col-12">
              <q-input
                v-model="newEntryData.code"
                label="Code"
                maxlength="10"
                counter
                autofocus
                :error="!newEntryData.code"
              >
                <template v-slot:hint>characters</template>
              </q-input>
              <div class="col-12 q-mt-lg">
                <q-input
                  v-model="newEntryData.name"
                  label="Name"
                  :error="!newEntryData.name"
                />
              </div>
              <div class="col-12 q-mt-lg">
                <q-select
                  v-model="newEntryData.section"
                  :options="sectionSelectOptions"
                  label="Section"
                  outlined
                  behavior="menu"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="right" class="q-py-md bg-grey-2">
          <q-btn label="Add" color="green-5" type="submit" />
          <q-btn label="Reset" color="red-5" type="reset" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { confirmDialog, onFailure, onSuccess } from 'src/utils/notification';
import { ref, reactive, computed, watch, watchEffect, onMounted } from 'vue';

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

const isAddNewEntryModalActive = ref(false);
const fetchingData = ref(false);
const natureEntry = ref<NatureEntry[]>([]);
const searchQuery = ref<string | null>('');
const filteredNatureEntry = computed(() => {
  if (searchQuery.value) {
    return natureEntry.value.filter((entry) =>
      entry.code.includes(searchQuery.value!)
    );
  }
  return natureEntry.value;
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

const newEntryData = reactive({
  code: '',
  name: '',
  section: sectionSelectOptions[0],
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
];

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

const deleteEntryConfirmed = async (rowIndex: number) => {
  const rsp = await api.delete(
    `natureEntry/${natureEntry.value[rowIndex].code}`
  );
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'delete' });

    natureEntry.value = [
      ...natureEntry.value.splice(0, rowIndex),
      ...natureEntry.value.splice(rowIndex + 1),
    ];
  }
};

const isCodeDuplicate = (code: string, section: string) =>
  natureEntry.value.some(
    (item) => item.code === code && item.section === section
  );

const saveNewEntry = async () => {
  if (newEntryData.code && newEntryData.name) {
    if (isCodeDuplicate(newEntryData.code, newEntryData.section.value)) {
      onFailure({
        msg: 'Code already present ( Code must be unique ).',
        icon: 'warning',
      });
    } else {
      const rsp = await api.post('natureEntry', {
        ...newEntryData,
        section: newEntryData.section.value,
      });

      if (rsp.data) {
        onSuccess({ msg: rsp.data.displayMessage, icon: 'check' });
        natureEntry.value.push({
          ...newEntryData,
          section: newEntryData.section.value,
        });
      }
    }
  }
};

const resetNewEntryForm = () => {
  newEntryData.code = '';
  newEntryData.name = '';
  newEntryData.section = sectionSelectOptions[0];
};

watch(searchQuery, () => {
  if (searchQuery.value) {
    searchQuery.value = searchQuery.value.trim().toUpperCase();
  }
});

watchEffect(() => {
  newEntryData.code = newEntryData.code.trim().toUpperCase();
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get('natureEntry');

  if (rsp.data) {
    natureEntry.value = rsp.data;
  }
  fetchingData.value = false;
});
</script>

<style scoped></style>
