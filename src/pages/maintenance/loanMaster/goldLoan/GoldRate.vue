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
            <div class="row full-width justify-between">
              <div class="col-xs-12 col-sm-4 col-md-3 text-h6 q-pt-md">
                Gold Rate
              </div>
              <div class="col-xs-12 col-sm-5 col-md-3 q-pt-md">
                <q-input
                  v-model="rate"
                  outlined
                  dense
                  no-error-icon
                  :error="isDuplicate"
                  type="number"
                  error-message="Item already exits"
                  placeholder="Rate"
                >
                  <template v-slot:prepend> Gold </template>
                  <template v-slot:after>
                    <q-btn
                      icon="add"
                      color="teal"
                      size="md"
                      :disable="isDuplicate || rate === null"
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
                <q-btn-group push unelevated>
                  <q-btn
                    icon="edit"
                    size="xs"
                    outline
                    color="accent"
                    v-if="editingRowIndex !== props.rowIndex"
                    @click="() => editEntry(props.row.id, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    label="delete"
                    size="xs"
                    outline
                    color="red"
                    @click="deleteRate(props.row.id)"
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
              <q-td key="rate" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="editRate"
                  placeholder="rate required"
                  dense
                  outlined
                  :color="editRate ? 'green' : 'red'"
                  type="number"
                  autofocus
                />
                <span v-else>{{ props.row.rate }} </span>
              </q-td>

              <q-td :props="props" key="updatedOn">
                {{ formatDate(props.row.updatedOn, format) }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Rate :</div>
                    <div class="col-12">
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="editRate"
                        placeholder="rate required"
                        dense
                        outlined
                        :color="editRate ? 'green' : 'red'"
                        type="number"
                        autofocus
                      />
                      <span v-else>
                        {{ props.row.rate }}
                      </span>
                    </div>
                  </div>
                </q-card-section>
                <template v-for="key in ['updatedOn']" :key="key">
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
                    @click="() => editEntry(props.row.id, props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="editingRowIndex !== props.rowIndex"
                    label="delete"
                    size="sm"
                    color="red"
                    @click="deleteRate(props.row.id)"
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
import { ref, onMounted, computed, watch } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';
import { capitalCase } from 'src/utils/string';

interface GoldRates {
  rate: number | null;
  id: number | null;
  updatedOn: string;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/goldRate',
    label: 'Loan Master',
    disable: true,
  },
  {
    path: '/module/maintenance/loanMaster/goldRate',
    label: 'Gold Rate',
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
    name: 'rate',
    required: true,
    align: 'left',
    field: 'rate',
    label: 'Rate',
  },

  {
    name: 'updatedOn',
    required: true,
    align: 'left',
    field: 'updatedOn',
    label: 'Updated On',
  },
];

const $q = useQuasar();
const fetchingData = ref(false);
const rate = ref<number | null>(null);
const goldRates = ref<GoldRates[]>([]);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const editRate = ref<number | null>(null);
const format = 'DD/MM/YYYY @hh:mmA';

const filteredData = computed(() => goldRates.value);

const isDuplicate = computed(
  () => !!goldRates.value.find((item) => item.rate == rate.value)
);

const setFormData = () => {
  let temp;
  if (editingRowId.value !== null) {
    let index = goldRates.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = goldRates.value[index];
  }
  editRate.value = temp ? temp.rate : null;
};

const editEntryConfirmed = (id: number, index: number) => {
  editingRowIndex.value = index;
  editingRowId.value = id;
  setFormData();
};

const editEntry = (id: number, rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(id, rowIndex), {
      msg: 'Are you sure you want to cancel editing the current row?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(id, rowIndex);
  }
};
const saveEdited = async () => {
  const temp = goldRates.value.filter((item) => item.id !== editingRowId.value);

  const isDuplicate = temp.find((item) => item.rate == editRate.value);
  if (isDuplicate) {
    onFailure({
      msg: 'Item already exist',
      icon: 'warning',
    });
    return;
  }

  let payLoad = {
    rate: editRate.value,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.post('/goldRate', payLoad);
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    editingRowIndex.value = null;
    loadSource();
  }
};

const saveEntry = async () => {
  const rsp = await api.post('/goldRate', { rate: rate.value });
  if (rsp.data.displayMessage) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    rate.value = null;
    loadSource();
  }
};

const deleteRate = async (id: number) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => deleteConfirm(id), {
      msg: 'Are you sure you want to delete ?',
    });
  } else {
    return;
  }
};

const deleteConfirm = async (id: number) => {
  const rsp = await api.delete(`/goldRate/${id}`);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('goldRate/getTop10Rates');

  if (rsp.data) {
    goldRates.value = rsp.data;
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

<style scoped></style>
