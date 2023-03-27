<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredPreferences"
          :columns="columns"
          row-key="key"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="preferences"
          :no-data-label="'No result found'"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
          v-model:pagination="pagination"
          @update:pagination="(v) => upDataRowsPerPage(v)"
          :rows-per-page-options="[10, 20, 50, 100]"
          :hide-bottom="$q.screen.width < 830"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h4">Preferences</div>
                </div>
              </div>
              <div class="col-12">
                <q-input
                  v-model="searchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Search key"
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
                <q-btn-group v-if="editSaveFlag" push unelevated>
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
              <q-td key="key" :props="props">
                <span>{{ props.row.key }}</span>
              </q-td>
              <q-td key="value" :props="props">
                <q-input
                  v-if="isEditing && editingRowIndex === props.rowIndex"
                  v-model="editingData.value"
                  placeholder="value required"
                  dense
                  outlined
                  color="green"
                  autofocus
                />
                <span v-else>{{ props.row.value }}</span>
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
                    <div class="col-12 text-weight-medium">Value :</div>
                    <div class="col-12">
                      <template v-if="!isEditing">
                        {{ props.row.value }}
                      </template>
                      <q-input
                        v-if="isEditing && editingRowIndex === props.rowIndex"
                        v-model="editingData.value"
                        placeholder="Name required"
                        dense
                        outlined
                        color="green"
                        autofocus
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>

          <!-- pagination -->

          <template v-slot:pagination="scope">
            <div class="row">
              <div class="col-8 q-mt-sm q-pt-xs">Goto page no :</div>
              <div class="col-4 q-px-xs">
                <q-input
                  v-model.number="goToPage"
                  type="number"
                  dense
                  style="max-width: 60px"
                  @update:model-value="(v)=>goToPageNumber(v as number)"
                  :min="1"
                  :max="Math.ceil(totalCount / pagination.rowsPerPage)"
                />
              </div>
            </div>

            <p class="q-px-md q-mt-md">
              Page no : {{ pageNumber }} /
              {{ Math.ceil(totalCount / pagination.rowsPerPage) }}
            </p>
            <q-btn
              icon="first_page"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.pagination.page === pageNumber"
              @click="firstPage"
            />

            <q-btn
              icon="chevron_left"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.pagination.page === pageNumber"
              @click="prevPage"
            />

            <q-btn
              icon="chevron_right"
              color="grey-8"
              round
              dense
              flat
              :disable="lastPageNumber === pageNumber"
              @click="nextPage"
            />

            <q-btn
              icon="last_page"
              color="grey-8"
              round
              dense
              flat
              :disable="lastPageNumber === pageNumber"
              @click="lastPage"
            />
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
import { ref, reactive, computed, onMounted } from 'vue';

interface Preference {
  key: string;
  value: string;
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '', label: 'Preferences' },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});
const goToPage = ref();
const totalCount = ref(0);
const pageNumber = ref(1);
let lastPageNumber = 0;
const fetchingData = ref(false);
const preferences = ref<Preference[]>([]);
const searchQuery = ref<string | null>('');
const filteredPreferences = computed(() => {
  if (searchQuery.value) {
    return preferences.value.filter((entry) =>
      entry.key.includes(searchQuery.value!)
    );
  }
  return preferences.value;
});
const isEditing = ref(false);
const editSaveFlag = ref(true);
const editingRowIndex = ref(0);
const editingData = reactive<{
  value: string;
}>({
  value: '',
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
    name: 'key',
    required: true,
    align: 'left',
    field: 'code',
    label: 'Key',
  },
  {
    name: 'value',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Value',
  },
];

const editEntry = (rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(
      () => editEntryConfirmed(preferences.value[rowIndex], rowIndex),
      {
        msg: 'Are you sure you want to cancel editing the current Code?',
      }
    );
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(preferences.value[rowIndex], rowIndex);
  }
};

const editEntryConfirmed = (row: Preference, index: number) => {
  editingRowIndex.value = index;

  editingData.value = row.value;
};

const saveEdited = async (rowIndex: number) => {
  editSaveFlag.value = false;
  const rsp = await api.post('pref', {
    key: preferences.value[rowIndex].key,
    value: editingData.value,
  });

  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'sync_alt' });
    preferences.value[rowIndex].value = editingData.value;
    isEditing.value = false;
  }
  editSaveFlag.value = true;
};

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pagination.value.page
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
    totalCount.value = parseInt(rsp.data.id);
  }
  fetchingData.value = false;
});

const goToPageNumber = async (val: number) => {
  if (
    val > 0 &&
    val < Math.ceil(totalCount.value / pagination.value.rowsPerPage)
  ) {
    fetchingData.value = true;
    pageNumber.value = val;

    const rsp = await api.get(
      'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
    );

    if (rsp.data) {
      preferences.value = rsp.data.object;
    }
    fetchingData.value = false;
  }
};

const upDataRowsPerPage = async (val: { rowsPerPage: number }) => {
  fetchingData.value = true;
  const rsp = await api.get(
    'prefItems/' + val.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
    fetchingData.value = false;
  }
};
const firstPage = async () => {
  fetchingData.value = true;
  pageNumber.value = 1;

  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const prevPage = async () => {
  fetchingData.value = true;
  pageNumber.value -= 1;

  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const nextPage = async () => {
  fetchingData.value = true;
  pageNumber.value += 1;

  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const lastPage = async () => {
  fetchingData.value = true;
  pageNumber.value = Math.ceil(totalCount.value / pagination.value.rowsPerPage);
  lastPageNumber = pageNumber.value;
  console.log(pagination.value.page);

  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    preferences.value = rsp.data.object;
  }
  fetchingData.value = false;
};
</script>

<style scoped></style>
