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
                <q-btn
                  icon="edit"
                  size="xs"
                  outline
                  rounded
                  color="accent"
                  @click="() => editEntry(props.row.code, props.rowIndex)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </q-td>
              <q-td key="code" :props="props">
                <span>
                  {{ firstLetterCpitalze(props.row.code) }}
                </span>
              </q-td>

              <q-td key="name" :props="props">
                <span>
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
                      <span>
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
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </div>
  <q-dialog v-model="isEditModalActive">
    <CommonEditForMaintenancePages
      :editObject="editObject"
      @close="isEditModalActive = false"
      @saveEdit="saveEdit"
      editMsg="Edit Name Prefix"
    ></CommonEditForMaintenancePages>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, reactive } from 'vue';
import { onSuccess, onFailure } from 'src/utils/notification';
//import { tableTypeOne } from 'src/utils/types';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
import CommonEditForMaintenancePages from 'src/components/modals/CommonEditForMaintenancePages.vue';

interface CustomerCategory {
  code: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  name: string;
}

interface EditObject {
  firstInputValue: string;
  firstInputLabel: string;
  secondInputValue?: string;
  secondInputLabel?: string;
  inactive: boolean;
  editable: boolean;
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
const format = 'DD/MM/YYYY @hh:mmA';
const isEditModalActive = ref(false);
let editObject = reactive<EditObject>({
  firstInputValue: '',
  inactive: false,
  firstInputLabel: 'Code',
  secondInputValue: '',
  secondInputLabel: 'Name',
  editable: true,
});

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
  editObject.firstInputValue = temp ? temp.code : '';
  editObject.secondInputValue = temp ? temp.name : '';
  editObject.inactive = temp ? temp.inactive : false;
};

const editEntry = (code: string, rowIndex: number) => {
  editingRowIndex.value = rowIndex;
  editingRowCode.value = code;
  setFormData();
  isEditModalActive.value = true;
};

const saveEdit = (editSaveObject: EditObject) => {
  const { firstInputValue, inactive } = editSaveObject;

  const tempInactive = editObject.inactive;

  if (
    editSaveObject.firstInputValue !== editObject.firstInputValue ||
    editSaveObject.secondInputValue !== editObject.secondInputValue
  ) {
    const temp = customerCategory.value.filter(
      (item) => item.id !== editingRowIndex.value
    );

    const isDuplicate = temp.find(
      (item) =>
        item.name.toLowerCase() ===
          editSaveObject.firstInputValue.toLowerCase() &&
        item.code.toLowerCase() ===
          editSaveObject?.secondInputValue?.toLowerCase()
    );
    if (isDuplicate) {
      onFailure({
        msg: 'Item already exist',
        icon: 'warning',
      });
      return;
    }
    editObject = { ...editSaveObject };
    saveEditedConfirm();
  }

  if (inactive !== tempInactive) {
    changeActiveConfirm(editingRowCode.value!, editSaveObject.inactive);
  }

  editingRowIndex.value = null;
  isEditModalActive.value = false;
};

const saveEditedConfirm = async () => {
  let payLoad = {
    code: editObject.firstInputValue,
    name: editObject.secondInputValue,
    id: editingRowIndex.value,
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

const changeActiveConfirm = async (code: string, state: boolean) => {
  const str = state ? 'inactive' : 'active';
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
