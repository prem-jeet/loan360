<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

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
            <div class="row q-mb-xs-lg q-mb-sm-none q-mb-md-none q-pb-sm">
              <div class="col-12">
                <div class="row items-center">
                  <div class="col-auto text-h6">Customer Category</div>
                </div>
              </div>
            </div>

            <div
              class="row full-width items-center q-col-gutter-y-md q-pb-xs-md q-pb-sm-none q-pb-md-none"
            >
              <div class="col-xs-12 col-sm-6 col-md-6 q-pa-none q-pb-sm">
                <div class="row">
                  <div class="col-xs-12 col-sm-5 col-md-5">
                    <q-input
                      v-model="codeSearchQuery"
                      outlined
                      clearable
                      dense
                      rounded
                      placeholder="search code"
                      @clear="codeSearchQuery = ''"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-5 col-md-5">
                    <q-checkbox
                      v-model="checkBox"
                      label=" In-Active"
                      @click="(editingRowIndex = null), (isEditing = false)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <div class="row mobile-border q-pa-md q-col-gutter-y-sm">
                  <div class="col-xs-12 col-sm-5 col-md-6 q-pa-xs">
                    <q-input
                      v-model="newCategory.code"
                      outlined
                      dense
                      clearable
                      :error="isDuplicate"
                      error-message="Item already exits"
                      no-error-icon
                      placeholder="code"
                      @clear="newCategory.code = ''"
                    >
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-5 col-md-5 q-pa-xs">
                    <q-input
                      v-model="newCategory.name"
                      clearable
                      outlined
                      dense
                      no-error-icon
                      placeholder="name"
                      @clear="newCategory.name = ''"
                    >
                    </q-input>
                  </div>
                  <div
                    class="col-xs-12 col-sm-1 col-md-1 text-center q-pa-xs q-mt-xs-md q-mt-sm-none q-mt-md-none"
                  >
                    <q-btn
                      icon="add"
                      color="teal"
                      size="md"
                      :disable="
                        newCategory.code === '' ||
                        newCategory.name === '' ||
                        isDuplicate
                      "
                      @click="saveEntry"
                    />
                  </div>
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
                    v-if="editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.row.code, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
                    @click="
                      () => changeActive(props.row.code, props.row.inactive)
                    "
                  >
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="saveEdited"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="close"
                    size="xs"
                    outline
                    color="red"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="(isEditing = false), (editingRowIndex = null)"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="code" :props="props">
                <span>
                  {{ firstLetterCpitalze(props.row.code) }}
                </span>
              </q-td>

              <q-td key="name" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editName"
                  placeholder="name required"
                  dense
                  outlined
                  color="green"
                  autofocus
                />
                <span v-else>
                  {{ firstLetterCpitalze(props.row.name) }}
                </span>
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
                    <div class="col-12 text-weight-medium">Code :</div>
                    <div class="col-12">
                      <span>
                        {{ firstLetterCpitalze(props.row.code) }}
                      </span>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="editName"
                        placeholder="Name required"
                        dense
                        outlined
                        color="green"
                        autofocus
                      />
                      <span v-else>
                        {{ firstLetterCpitalze(props.row.name) }}
                      </span>
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
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.row.code, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="sm"
                    color="red"
                    @click="
                      () => changeActive(props.row.code, props.row.inactive)
                    "
                  >
                  </q-btn>
                  <q-btn
                    label="save"
                    icon="save"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="saveEdited"
                  >
                    <q-tooltip>Save</q-tooltip>
                  </q-btn>
                  <q-btn
                    label="close"
                    icon="close"
                    size="sm"
                    color="red"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="(isEditing = false), (editingRowIndex = null)"
                  >
                    <q-tooltip>Cancel</q-tooltip>
                  </q-btn>
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
import { onSuccess, confirmDialog } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';

interface CustomerCategory {
  code: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  name: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/customerMaster/customerCategory',
    label: 'Customer Master',
    disable: true,
  },
  {
    path: '/module/maintenance/customerMaster/customerCategory',
    label: 'Customer Category',
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
const fetchingData = ref(false);
const codeSearchQuery = ref('');

const customerCategory = ref<CustomerCategory[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowCode = ref('');
const editCode = ref('');
const editName = ref('');
const format = 'DD/MM/YYYY @hh:mmA';

const newCategory = reactive<{ name: string; code: string }>({
  name: '',
  code: '',
});

const filteredData = computed(() =>
  customerCategory.value.filter(
    (item) =>
      item.code.toLowerCase().includes(codeSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value
  )
);

const isDuplicate = computed(
  () =>
    !!customerCategory.value.find(
      (item) =>
        item.code.toLocaleLowerCase() === newCategory.code.toLocaleLowerCase()
    )
);
const setFormData = () => {
  let temp;
  if (editingRowCode.value !== null) {
    let index = customerCategory.value.findIndex(
      (obj) => obj.code === editingRowCode.value
    );
    temp = customerCategory.value[index];
  }
  editCode.value = temp ? temp.code : '';
  editName.value = temp ? temp.name : '';
};

const editEntryConfirmed = (code: string, index: number) => {
  editingRowIndex.value = index;
  editingRowCode.value = code;
  setFormData();
};

const editEntry = (code: string, rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(code, rowIndex), {
      msg: 'Are you sure you want to cancel editing the current row?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(code, rowIndex);
  }
};
const saveEdited = async () => {
  let payLoad = {
    code: editCode.value,
    name: editName.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/customerCategory/update', payLoad);
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
    code: newCategory.code,
    name: newCategory.name,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/customerCategory', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    newCategory.code = '';
    newCategory.name = '';
    loadSource();
  }
};

const changeActive = (code: string, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(code, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to deactivate ?',
    });
  }
};

const changeActiveConfirm = async (code: string, state: boolean) => {
  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/customerCategory/' + str, {
    code,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('customerCategory');

  if (rsp.data) {
    customerCategory.value = rsp.data;
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

<style scoped>
@media (max-width: 600px) {
  /* Media query for mobile devices */
  .mobile-border {
    border: 2px solid rgb(176, 174, 174);
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
}
</style>
