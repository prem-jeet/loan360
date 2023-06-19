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
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Source Lead</div>
                </div>
              </div>
            </div>

            <div class="row full-width q-mt-sm">
              <div class="col-xs-12 col-sm-4 col-md-3 q-pb-sm">
                <q-input
                  v-model="nameSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="search"
                  @clear="nameSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-6 q-pb-sm">
                <q-checkbox v-model="checkBox" label=" In-Active" />
              </div>
              <div class="col-xs-12 col-sm-5 col-md-3 q-pb-sm">
                <q-input
                  v-model="leadName"
                  outlined
                  dense
                  no-error-icon
                  :error="isDuplicate"
                  error-message="Item already exits"
                  placeholder="name"
                >
                  <template v-slot:prepend> Lead </template>
                  <template v-slot:after>
                    <q-btn
                      icon="add"
                      color="teal"
                      size="md"
                      :disable="isDuplicate || leadName === ''"
                      @click="saveEntry"
                    />
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
              <q-td key="name" :props="props">
                <span> {{ firstLetterCpitalze(props.row.name) }} </span>
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
      editMsg="Edit Source"
    ></CommonEditForMaintenancePages>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, reactive } from 'vue';
import { onSuccess, onFailure } from 'src/utils/notification';
import { tableTypeOne } from 'src/utils/types';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { firstLetterCpitalze, capitalCase } from 'src/utils/string';
import CommonEditForMaintenancePages from 'src/components/modals/CommonEditForMaintenancePages.vue';
// interface Source {
//   name: string;
//   id: number | null;
//   createdOn: string;
//   inactive: boolean;
//   inactiveOn: string;
//   updatedOn: string;
// }

const breadcrumbs = [
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
    name: 'name',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Source Lead',
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
const leadName = ref('');
const nameSearchQuery = ref('');
const source = ref<tableTypeOne[]>([]);
const checkBox = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const format = 'DD/MM/YYYY @hh:mmA';
const isEditModalActive = ref(false);

let editObject = reactive<{
  firstInputValue: string;
  inactive: boolean;
  firstInputLabel: string;
}>({
  firstInputValue: '',
  inactive: false,
  firstInputLabel: 'Source',
});

const filteredData = computed(() =>
  source.value.filter(
    (item) =>
      item.name.toLowerCase().includes(nameSearchQuery.value.toLowerCase()) &&
      item.inactive === checkBox.value
  )
);

const isDuplicate = computed(
  () =>
    !!source.value.find((item) => item.name.toLocaleLowerCase() === name.value)
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = source.value.findIndex((obj) => obj.id === editingRowId.value);
    temp = source.value[index];
  }
  editObject.firstInputValue = temp ? temp.name : '';
  editObject.inactive = temp ? temp.inactive : false;
};

const editEntry = (id: number) => {
  editingRowId.value = id;
  setFormData();
  isEditModalActive.value = true;
};
const saveEdit = (editSaveObject: {
  firstInputValue: string;
  inactive: boolean;
  firstInputLabel: string;
}) => {
  const { firstInputValue, inactive } = editSaveObject;
  const tempInactive = editObject.inactive;

  if (firstInputValue !== editObject.firstInputValue) {
    const temp = source.value.filter((item) => item.id !== editingRowId.value);

    const isDuplicate = temp.find(
      (item) =>
        item.name.toLowerCase() === editSaveObject.firstInputValue.toLowerCase()
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
    name: editObject.firstInputValue,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/sourceLead/update', payLoad);
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
    name: leadName.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/sourceLead', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    leadName.value = '';
    loadSource();
  }
};

const changeActiveConfirm = async (id: number, state: boolean) => {
  const str = state ? 'inactive' : 'active';
  const rsp = await api.put('/sourceLead/' + str, {
    id,
  });
  if (rsp.data && rsp.data.displayMessage) {
    onSuccess({ msg: rsp.data.displayMessage });
    loadSource();
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('sourceLead');

  if (rsp.data) {
    source.value = rsp.data;
  }
  fetchingData.value = false;
};

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
