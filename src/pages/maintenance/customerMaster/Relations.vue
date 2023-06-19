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
            <div class="row q-mb-xs-lg q-my-sm">
              <div class="col-12">
                <div class="row items-center">
                  <div class="col-auto text-h6">Relations</div>
                </div>
              </div>
            </div>

            <div
              class="row full-width items-center q-col-gutter-y-md q-pb-xs-md q-pb-sm-none q-pb-md-none"
            >
              <div class="col-xs-12 col-sm-6 col-md-6 q-pa-none q-pb-sm">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-xs-12 col-sm-4 col-md-4 q-pr-sm">
                    <q-input
                      v-model="forwardSearchQuery"
                      outlined
                      clearable
                      dense
                      rounded
                      placeholder="search Forward"
                      @clear="forwardSearchQuery = ''"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4 q-pr-sm">
                    <q-input
                      v-model="backwardSearchQuery"
                      outlined
                      clearable
                      dense
                      rounded
                      placeholder="search backward"
                      @clear="backwardSearchQuery = ''"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-4 col-md-4">
                    <q-checkbox
                      v-model="checkBox"
                      label=" In-Active"
                      @click="(editingRowIndex = null), (isEditing = false)"
                    />
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 q-pt-none">
                <div class="row mobile-border q-pa-md q-col-gutter-y-sm">
                  <div class="col-xs-12 col-sm-5 col-md-6 q-pa-xs">
                    <q-input
                      v-model="newRelation.forward"
                      outlined
                      dense
                      clearable
                      no-error-icon
                      placeholder="forward"
                      @clear="newRelation.forward = ''"
                    >
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-5 col-md-5 q-pa-xs">
                    <q-input
                      v-model="newRelation.backward"
                      clearable
                      outlined
                      dense
                      hide-bottom-space
                      no-error-icon
                      placeholder="backward"
                      @clear="newRelation.backward = ''"
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
                        newRelation.forward === '' ||
                        newRelation.backward === ''
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
                  v-if="editingRowIndex !== props.rowIndex"
                  @click="() => editEntry(props.row.id)"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
              </q-td>
              <q-td key="forward" :props="props">
                <span>
                  {{ firstLetterCpitalze(props.row.forward) }}
                </span>
              </q-td>

              <q-td key="backward" :props="props">
                <span>
                  {{ firstLetterCpitalze(props.row.backward) }}
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
                    <div class="col-12 text-weight-medium">Forward :</div>
                    <div class="col-12">
                      <span>
                        {{ firstLetterCpitalze(props.row.forward) }}
                      </span>
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Backward :</div>
                    <div class="col-12">
                      <span>
                        {{ firstLetterCpitalze(props.row.backward) }}
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
                    @click="() => editEntry(props.row.id)"
                  >
                  </q-btn>
                </q-card-actions>
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

interface Relations {
  forward: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  backward: string;
}

interface EditObject {
  firstInputValue: string;
  firstInputLabel: string;
  secondInputValue?: string;
  secondInputLabel?: string;
  inactive: boolean;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/customerMaster/relation',
    label: 'Customer Master',
    disable: true,
  },
  {
    path: '/module/maintenance/customerMaster/relation',
    label: 'Relations',
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
    name: 'forward',
    required: true,
    align: 'left',
    field: 'forward',
    label: 'Forward',
  },
  {
    name: 'backward',
    required: true,
    align: 'left',
    field: 'backward',
    label: 'Backward',
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
const forwardSearchQuery = ref('');
const backwardSearchQuery = ref('');
const relations = ref<Relations[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const format = 'DD/MM/YYYY @hh:mmA';
const isEditModalActive = ref(false);
let editObject = reactive<EditObject>({
  firstInputValue: '',
  inactive: false,
  firstInputLabel: 'Forward',
  secondInputValue: '',
  secondInputLabel: 'Backward',
});

const newRelation = reactive<{ forward: string; backward: string }>({
  forward: '',
  backward: '',
});

const filteredData = computed(() =>
  relations.value.filter(
    (item) =>
      item.forward
        .toLowerCase()
        .includes(forwardSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value &&
      item.backward
        .toLowerCase()
        .includes(backwardSearchQuery.value.toLowerCase())
  )
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = relations.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = relations.value[index];
  }
  editObject.firstInputValue = temp ? temp.forward : '';
  editObject.secondInputValue = temp ? temp.backward : '';
  editObject.inactive = temp ? temp.inactive : false;
};

const editEntry = (id: number) => {
  editingRowId.value = id;
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
    const temp = relations.value.filter(
      (item) => item.id !== editingRowId.value
    );

    const isDuplicate = temp.find(
      (item) =>
        item.forward.toLowerCase() ===
          editSaveObject.firstInputValue.toLowerCase() &&
        item.backward.toLowerCase() ===
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
    changeActiveConfirm(editingRowId.value!, editSaveObject.inactive);
  }

  editingRowId.value = null;
  isEditModalActive.value = false;
};

const saveEditedConfirm = async () => {
  let payLoad = {
    forward: editObject.firstInputValue,
    backward: editObject.secondInputValue,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/relation/update', payLoad);
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
    forward: newRelation.forward,
    backward: newRelation.backward,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/relation', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    newRelation.forward = '';
    newRelation.backward = '';
    loadSource();
  }
};

const changeActiveConfirm = async (id: number, state: boolean) => {
  const str = state ? 'inactive' : 'active';
  const rsp = await api.put('/relation/' + str, {
    id,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('relation');

  if (rsp.data) {
    relations.value = rsp.data;
  }
  fetchingData.value = false;
};

onMounted(() => {
  loadSource();
});

// function onFailure(arg0: { msg: string; icon: string }) {
//   throw new Error('Function not implemented.');
// }
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
