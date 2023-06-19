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
          no-data-label="No result found"
          :rows-per-page-options="[0]"
          :hide-bottom="!!filteredData.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-y-lg q-pb-xs-md">
              <div class="col-12">
                <div class="row items-center q-gutter-md">
                  <div class="col-auto text-h6">Bureau ScoreRate</div>
                  <div class="col-auto">
                    <q-btn
                      color="blue-7"
                      icon="add"
                      label="Add new"
                      size="md"
                      @click="newEntry()"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row full-width q-mt-sm">
              <div class="col-xs-12 col-sm-3 col-md-6 q-pb-sm">
                <q-checkbox v-model="checkBox" label=" In-Active" />
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
                    @click="editEntry(props.rowIndex)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
                    @click="changeActive(props.row.id, props.row.inactive)"
                  >
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td key="scoreFrom" :props="props">
                {{ props.row.scoreFrom }}
              </q-td>
              <q-td key="scoreUpto" :props="props">
                {{ props.row.scoreUpto }}
              </q-td>
              <q-td key="rate" :props="props">
                {{ props.row.rate }}
              </q-td>

              <q-td key="createdOn" :props="props">
                {{
                  props.row.createdOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
              <q-td key="updatedOn" :props="props">
                {{
                  props.row.updatedOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
              <q-td key="inactiveOn" :props="props">
                {{
                  props.row.inactiveOn.toLocaleString('en-US', DateTimeOptions)
                }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Score From:</div>
                    <div class="col-12">
                      {{ props.row.scoreFrom }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Score Upto :</div>
                    <div class="col-12">
                      {{ props.row.scoreUpto }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">rate :</div>
                    <div class="col-12">
                      {{ props.row.rate }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs items-center">
                    <div class="col-12 text-weight-medium">CreatedOn :</div>
                    <div class="col-12">
                      {{
                        props.row.createdOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs items-center">
                    <div class="col-12 text-weight-medium">UpdatedOn :</div>
                    <div class="col-12">
                      {{
                        props.row.updatedOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs items-center">
                    <div class="col-12 text-weight-medium">inactiveOn :</div>
                    <div class="col-12">
                      {{
                        props.row.inactiveOn.toLocaleString(
                          'en-US',
                          DateTimeOptions
                        )
                      }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    @click="editEntry(props.rowIndex)"
                  >
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="sm"
                    color="red"
                    @click="changeActive(props.row.id, props.row.inactive)"
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
  <q-dialog v-model="isEntryModalActive">
    <q-card style="width: 500px">
      <q-form @submit.prevent="saveEntry" @reset="setFormData()">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl">{{
              mode === 'new' ? 'Add Bureau ScoreRate' : 'Edit Bureau ScoreRate'
            }}</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isEntryModalActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-sm">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-sm">
                <q-input
                  outlined
                  v-model.number="newSource.scoreFrom"
                  label="Score From"
                  dense
                  type="number"
                  :rules="[(val:number) => val!==null]"
                />
              </div>
              <div class="col-12 q-mt-sm">
                <q-input
                  outlined
                  v-model.number="newSource.scoreUpto"
                  label="Score Upto"
                  dense
                  type="number"
                  :rules="[(val:number) => val!==null]"
                />
              </div>
              <div class="col-12 q-mt-sm">
                <q-input
                  outlined
                  v-model.number="newSource.rate"
                  label="Rate"
                  dense
                  type="number"
                  :rules="[(val:number) => val!==null]"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
          <q-btn
            :label="editingRowIndex === null ? 'Add' : 'Save '"
            :icon="editingRowIndex === null ? 'add' : 'save '"
            color="teal"
            type="submit"
          />
          <q-btn label="Reset" color="red-5" type="reset" icon="refresh" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { onSuccess, confirmDialog } from 'src/utils/notification';
import { ref, onMounted, computed, watch, reactive } from 'vue';

interface BureauScore {
  createdOn: string;
  inactive: boolean;
  inactiveOn: string;
  updatedOn: string;
  id: number | null;
  rate: number | null;
  scoreFrom: number | null;
  scoreUpto: number | null;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/bureauScoreRate',
    label: 'Loan Master',
  },
  {
    path: '/module/maintenance/loanMaster/bureauScoreRate',
    label: 'Bureau ScoreRate',
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
    name: 'scoreFrom',
    required: true,
    align: 'left',
    field: 'scoreFrom',
    label: 'Score From',
  },
  {
    name: 'scoreUpto',
    required: true,
    align: 'left',
    field: 'scoreUpto',
    label: 'Score Upto',
  },

  {
    name: 'rate',
    required: true,
    align: 'left',
    field: 'rate',
    label: 'Rate',
  },

  {
    name: 'createdOn',
    required: true,
    align: 'left',
    field: 'createdOn',
    label: 'Created',
  },
  {
    name: 'updatedOn',
    required: true,
    align: 'left',
    field: 'updatedOn',
    label: 'Updated',
  },
  {
    name: 'inactiveOn',
    required: true,
    align: 'left',
    field: 'inactiveOn',
    label: 'In-Active',
  },
];

const DateTimeOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour format
};

const newSource = reactive<BureauScore>({
  createdOn: '',
  inactive: false,
  inactiveOn: '',
  updatedOn: '',
  id: null,
  rate: null,
  scoreFrom: null,
  scoreUpto: null,
});

let mode: 'new' | 'edit' = 'new';
const checkBox = ref(false);
const isEntryModalActive = ref(false);
const fetchingData = ref(false);
const bureauScore = ref<BureauScore[]>([]);
const bureauScoreTemp = ref<BureauScore[]>([]);

const editingRowIndex = ref<number | null>(null);

const filteredData = computed(() => {
  return bureauScore.value;
});

const setFormData = () => {
  let temp;
  if (editingRowIndex.value !== null) {
    temp = bureauScore.value[editingRowIndex.value];
  }

  newSource.scoreFrom = temp ? temp.scoreFrom : null;
  newSource.scoreUpto = temp ? temp.scoreUpto : null;
  newSource.rate = temp ? temp.rate : null;
  newSource.id = temp ? temp.id : null;
};

const newEntry = () => {
  mode = 'new';
  editingRowIndex.value = null;
  setFormData();
  isEntryModalActive.value = true;
};
const editEntry = (index: number) => {
  mode = 'edit';
  editingRowIndex.value = index;
  setFormData();
  isEntryModalActive.value = true;
};

const saveNewEntry = async () => {
  let payLoad = {
    scoreFrom: newSource.scoreFrom,
    scoreUpto: newSource.scoreUpto,
    rate: newSource.rate,
    createdOn: new Date(),
    inactive: false,
  };

  const rsp = await api.post('/bureauScoreRate', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadSource();
    isEntryModalActive.value = false;
  }
};

const saveEdited = async () => {
  let payLoad = {
    id: newSource.id,
    scoreFrom: newSource.scoreFrom,
    scoreUpto: newSource.scoreUpto,
    rate: newSource.rate,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/bureauScoreRate/update', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    loadSource();
    isEntryModalActive.value = false;
    editingRowIndex.value = null;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveNewEntry() : saveEdited();
};

const changeActive = async (id: number, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(id, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to deactivate ?',
    });
  } else {
    return;
  }
};

const changeActiveConfirm = async (id: number, state: boolean) => {
  const payLoad = {
    id: id,
  };

  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/bureauScoreRate/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('bureauScoreRate');

  if (rsp.data) {
    const transformedData = rsp.data.map(
      (item: {
        createdOn: string | number | Date;
        updatedOn: string | number | Date;
        inactiveOn: string | number | Date;
      }) => {
        return {
          ...item,
          createdOn: item.createdOn !== null ? new Date(item.createdOn) : '',
          updatedOn: item.updatedOn !== null ? new Date(item.updatedOn) : '',
          inactiveOn: item.inactiveOn !== null ? new Date(item.inactiveOn) : '',
        };
      }
    );
    bureauScore.value = transformedData.filter(
      (item: { inactive: boolean }) => item.inactive === checkBox.value
    );
    bureauScoreTemp.value = transformedData;
    console.log(bureauScore.value);
  }
  fetchingData.value = false;
};

watch(checkBox, () => {
  bureauScore.value = bureauScoreTemp.value.filter(
    (item) => item.inactive === checkBox.value
  );
});

onMounted(async () => {
  loadSource();
});
</script>

<style scoped></style>
