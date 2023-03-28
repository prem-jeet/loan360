<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredConfigurations"
          :columns="columns"
          row-key="key"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Configurations"
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
                  <div class="col-auto text-h4">Configurations</div>
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
            <!-- pagination  < 800px -->
            <div v-if="$q.screen.width < 830" class="col-12">
              <div class="row items-center">
                <div class="col-xs-8 col-sm-10 q-pt-sm">
                  <q-card-section class="flex items-center q-pa-none">
                    <q-btn
                      color="white"
                      size="sm"
                      text-color="black"
                      label="Goto Page"
                      @click="goToPageNumber"
                    />
                    <q-input
                      v-model.number="pageNumber"
                      type="number"
                      dense
                      :style="{ width: '50px' }"
                      :min="1"
                      :max="Math.ceil(totalCount / pagination.rowsPerPage)"
                      class="q-pa-sm"
                    />
                    /{{ Math.ceil(totalCount / pagination.rowsPerPage) }}
                  </q-card-section>
                </div>

                <div class="col-xs-4 col-sm-2 q-pr-sm">
                  <q-select
                    dense
                    v-model="pagination.rowsPerPage"
                    :options="[10, 20, 50, 100]"
                    label="Rows per page"
                    @update:model-value="upDataRowsPerPageInMobile"
                  />
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
                <q-btn-group v-if="saveEditFlag" push unelevated>
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

          <!-- pagination  > 800px -->

          <template v-slot:pagination="scope">
            <div class="row q-mr-sm q-pt-xs">
              <div class="col-auto q-mt-sm q-pt-xs">
                <q-btn
                  color="white"
                  size="sm"
                  text-color="black"
                  label="Goto Page"
                  @click="goToPageNumber"
                />
              </div>
              <div class="col-auto q-ml-md">
                <q-input
                  v-model.number="pageNumber"
                  type="number"
                  dense
                  style="max-width: 70px"
                  :min="1"
                  :max="Math.ceil(totalCount / pagination.rowsPerPage)"
                />
              </div>
              <div class="col-auto q-mt-xs q-ml-sm q-pt-xs">
                <p class="text-subtitle1 text-weight-regular">
                  /{{ Math.ceil(totalCount / pagination.rowsPerPage) }}
                </p>
              </div>
            </div>

            <q-btn
              icon="first_page"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.pagination.page === pageNumber"
              @click="firstPage"
              class="q-mb-xs"
            />

            <q-btn
              icon="chevron_left"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.pagination.page === pageNumber"
              @click="prevPage"
              class="q-mb-xs"
            />

            <q-btn
              icon="chevron_right"
              color="grey-8"
              round
              dense
              flat
              :disable="lastPageNumber === pageNumber"
              @click="nextPage"
              class="q-mb-xs"
            />

            <q-btn
              icon="last_page"
              color="grey-8"
              round
              dense
              flat
              :disable="lastPageNumber === pageNumber"
              @click="lastPage"
              class="q-mb-xs"
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
import { ref, reactive, computed, watch, onMounted } from 'vue';

interface Configuration {
  key: string;
  value: string;
}

const breadcrumbs = [
  { path: '/module/settings', label: 'Settings' },
  { path: '', label: 'Configurations' },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
});
const totalCount = ref(0);
const pageNumber = ref(1);
let lastPageNumber = 0;
const fetchingData = ref(false);
const configurations = ref<Configuration[]>([]);
const searchQuery = ref<string | null>('');
const filteredConfigurations = computed(() => {
  if (searchQuery.value) {
    return configurations.value.filter((entry) =>
      entry.key.includes(searchQuery.value!)
    );
  }
  return configurations.value;
});
const isEditing = ref(false);
const saveEditFlag = ref(true);
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
      () => editEntryConfirmed(configurations.value[rowIndex], rowIndex),
      {
        msg: 'Are you sure you want to cancel editing the current Code?',
      }
    );
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(configurations.value[rowIndex], rowIndex);
  }
};

const editEntryConfirmed = (row: Configuration, index: number) => {
  editingRowIndex.value = index;

  editingData.value = row.value;
};

const saveEdited = async (rowIndex: number) => {
  saveEditFlag.value = false;
  const rsp = await api.post('config', {
    key: configurations.value[rowIndex].key,
    value: editingData.value,
  });

  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage, icon: 'sync_alt' });
    configurations.value[rowIndex].value = editingData.value;
    isEditing.value = false;
  }
  saveEditFlag.value = true;
};

watch(searchQuery, () => {
  if (searchQuery.value) {
    searchQuery.value = searchQuery.value.trim().toUpperCase();
  }
});

onMounted(async () => {
  fetchingData.value = true;
  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pagination.value.page
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
    totalCount.value = parseInt(rsp.data.code);
  }
  fetchingData.value = false;
});
watch(pageNumber, () => {
  if (pageNumber.value < 1) {
    pageNumber.value = 1;
  } else if (
    pageNumber.value >
    Math.ceil(totalCount.value / pagination.value.rowsPerPage)
  ) {
    pageNumber.value = Math.ceil(
      totalCount.value / pagination.value.rowsPerPage
    );
  }
});
const upDataRowsPerPage = async (val: { rowsPerPage: number }) => {
  fetchingData.value = true;
  const rsp = await api.get(
    'configItems/' + val.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
    fetchingData.value = false;
  }
};
const upDataRowsPerPageInMobile = async () => {
  fetchingData.value = true;
  const rsp = await api.get(
    'prefItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
    fetchingData.value = false;
  }
};

const goToPageNumber = async () => {
  fetchingData.value = true;
  console.log(pageNumber.value, pagination.value.rowsPerPage);

  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
  }
  fetchingData.value = false;
};
const firstPage = async () => {
  fetchingData.value = true;
  pageNumber.value = 1;

  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const prevPage = async () => {
  fetchingData.value = true;
  pageNumber.value -= 1;

  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const nextPage = async () => {
  fetchingData.value = true;
  pageNumber.value += 1;

  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
  }
  fetchingData.value = false;
};

const lastPage = async () => {
  fetchingData.value = true;
  pageNumber.value = Math.ceil(totalCount.value / pagination.value.rowsPerPage);
  lastPageNumber = pageNumber.value;
  console.log(pagination.value.page);

  const rsp = await api.get(
    'configItems/' + pagination.value.rowsPerPage + '/' + pageNumber.value
  );

  if (rsp.data) {
    configurations.value = rsp.data.object;
  }
  fetchingData.value = false;
};
</script>

<style scoped></style>
