<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredbureauScore"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          no-data-label="No result found"
          :rows-per-page-options="[0]"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
          binary-state-sort
          :hide-bottom="!!bureauScore.length"
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
                      @click="isFormActive = true"
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
                    @click="
                      editingRowId = props.row.id;
                      isFormActive = true;
                    "
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'de-activate'"
                    size="xs"
                    outline
                    color="red"
                    @click="
                      () => toggleActiveState(props.row.id, props.row.inactive)
                    "
                  >
                  </q-btn>
                </q-btn-group>
              </q-td>
              <q-td
                :props="props"
                v-for="key in ['scoreFrom', 'scoreUpto', 'rate']"
                :key="key"
              >
                {{ props.row[key] }}
              </q-td>

              <template
                :key="key"
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
              >
                <q-td :props="props">
                  {{ fixDateFormat(props.row[key]) }}
                </q-td>
              </template>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section
                  v-for="key in ['scoreFrom', 'scoreUpto', 'rate']"
                  :key="key"
                  class="q-pb-none"
                >
                  <div class="text-weight-medium">
                    {{ props.colsMap[key].label }}
                  </div>
                  <div>
                    {{ props.row[key] }}
                  </div>
                </q-card-section>

                <template
                  :key="key"
                  v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
                >
                  <q-card-section v-if="props.row[key]" class="q-pb-none">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{ fixDateFormat(props.row[key]) }}
                    </div>
                  </q-card-section>
                </template>

                <q-card-actions
                  align="center"
                  class="q-py-md bg-grey-2 q-mt-md"
                >
                  <q-btn
                    label="edit"
                    icon="edit"
                    size="sm"
                    color="teal"
                    @click="
                      editingRowId = props.row.id;
                      isFormActive = true;
                    "
                  >
                  </q-btn>
                  <q-btn
                    :label="props.row.inactive ? 'activate' : 'de-activate'"
                    size="sm"
                    color="red"
                    @click="
                      () => toggleActiveState(props.row.id, props.row.inactive)
                    "
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
  <q-dialog
    v-model="isFormActive"
    @before-hide="editingRowId = null"
    @before-show="setCurrentFormData"
  >
    <q-card style="width: 500px">
      <q-form @submit.prevent="saveEntry" @reset="setCurrentFormData">
        <q-card-section class="bg-grey-2">
          <div class="flex items-center">
            <span class="text-bold q-mr-xl">{{
              `${editingRowId ? 'Edit' : 'Add'} Bureau ScoreRate`
            }}</span>
            <q-space />
            <q-btn
              class="q-ml-xs-md q-ml-sm-xl"
              icon="close"
              flat
              @click="isFormActive = false"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-px-lg q-py-sm">
          <div class="row">
            <div class="col-12">
              <div class="col-12 q-mt-sm">
                <q-input
                  v-for="input in [
                    { key: 'scoreFrom', label: 'Score From' },
                    { key: 'scoreUpto', label: 'Score Upto' },
                  ]"
                  :key="input.key"
                  outlined
                  v-model.number="currentFormData[input.key as keyof ScoreRateForm]"
                  :label="input.label"
                  dense
                  :mask="'#'.repeat(4)"
                  no-error-icon
                  :rules="[(val) => val !== null && val !== '']"
                />
              </div>

              <div class="col-12 q-mt-sm">
                <q-input
                  outlined
                  v-model.number="currentFormData.rate"
                  label="Rate(%)"
                  dense
                  no-error-icon
                  :rules="[(val) => val !== null && val !== '']"
                  :mask="'#'.repeat(3)"
                  @update:model-value="
                    (val) => {
                      if (typeof val === 'number' && val > 100) {
                        currentFormData.rate = 100;
                      }
                    }
                  "
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator class="q-mt-md" />
        <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
          <q-btn
            :label="editingRowId ? 'Save' : 'Add '"
            :icon="editingRowId ? 'save' : 'add '"
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
import { formatDate } from 'src/utils/date';
import { onSuccess, confirmDialog } from 'src/utils/notification';
import { ref, onMounted, computed } from 'vue';

interface BureauScore {
  createdOn: string | null;
  inactive: boolean | null;
  inactiveOn: string | null;
  updatedOn: string | null;
  id: number | null;
  rate: number | null;
  scoreFrom: number | null;
  scoreUpto: number | null;
}

interface ScoreRateForm {
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

// replace the typedef with column type when account head is merged
const columns: {
  name: string;
  required?: boolean;
  label: string;
  field: string;
  align: 'left';
  sortable?: boolean;
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
    sortable: true,
  },
  {
    name: 'scoreUpto',
    required: true,
    align: 'left',
    field: 'scoreUpto',
    label: 'Score Upto',
    sortable: true,
  },

  {
    name: 'rate',
    required: true,
    align: 'left',
    field: 'rate',
    label: 'Rate',
    sortable: true,
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

const dateFormat = 'DD/MM/YYYY hh:mmA';

const editingRowId = ref<number | null>(null);
const checkBox = ref(false);
const isFormActive = ref(false);
const fetchingData = ref(false);
const bureauScore = ref<BureauScore[]>([]);
const currentFormData = ref<ScoreRateForm>({
  rate: null,
  scoreFrom: null,
  scoreUpto: null,
});

const filteredbureauScore = computed(() => {
  if (!bureauScore.value.length) {
    return [];
  }
  return bureauScore.value.filter(
    (score) => !!score.inactive === checkBox.value
  );
});

const initialFormData = computed(() => {
  const temp: ScoreRateForm = {
    rate: null,
    scoreFrom: null,
    scoreUpto: null,
  };

  if (editingRowId.value) {
    const editingRow = bureauScore.value.find(
      (score) => score.id === editingRowId.value
    );
    if (editingRow) {
      temp.rate = editingRow.rate;
      temp.scoreFrom = editingRow.scoreFrom;
      temp.scoreUpto = editingRow.scoreUpto;
    }
  }

  return temp;
});

const fixDateFormat = (dateString: string | null) =>
  dateString !== null ? formatDate(dateString, dateFormat) : '';

const setCurrentFormData = () => {
  currentFormData.value = { ...initialFormData.value };
};

const saveEntry = async () => {
  let payload: Partial<BureauScore> = {
    ...currentFormData.value,
    inactive: false,
  };
  const editingRow = filteredbureauScore.value.find(
    (score) => score.id === editingRowId.value
  );
  if (editingRow) {
    payload.id = editingRow.id;
    payload.inactive =
      editingRow.inactive === null ? false : editingRow.inactive;
  }
  const method = editingRow ? 'put' : 'post';
  const endpoint = `/bureauScoreRate/${editingRow ? 'update' : ''}`;
  // replace with new post and put method with try and catch
  const rsp = await api[method](endpoint, payload);

  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });

    const currentTime = new Date().toString();

    const newScoreRate: BureauScore = {
      createdOn: editingRow ? editingRow.createdOn : currentTime,
      updatedOn: editingRow ? currentTime : null,
      inactive: payload.inactive!,
      inactiveOn: editingRow ? editingRow.inactiveOn : null,
      id: editingRow ? editingRow.id : rsp.data.id,
      rate: payload.rate!,
      scoreFrom: payload.scoreFrom!,
      scoreUpto: payload.scoreUpto!,
    };

    if (editingRow) {
      bureauScore.value = bureauScore.value.map((score) => {
        if (score.id === editingRow.id) {
          return { ...newScoreRate };
        }
        return score;
      });
    } else {
      bureauScore.value = [
        ...bureauScore.value,
        {
          ...newScoreRate,
        },
      ];
    }
    bureauScore.value.sort((a, b) => (a.scoreFrom! <= b.scoreFrom! ? -1 : 1));
  }

  isFormActive.value = false;
};

const toggleActiveState = async (id: number, inActive: boolean) => {
  // replace with async dialog
  confirmDialog(
    async () => {
      const rsp = await api.put(
        `/bureauScoreRate/${inActive ? 'active' : 'inactive'}`,
        { id }
      );
      if (rsp.data) {
        onSuccess({ msg: rsp.data.displayMessage });
      }

      bureauScore.value.forEach((score) => {
        if (score.id === id) {
          score.inactive = !inActive;
          if (!inActive) {
            score.inactiveOn = new Date().toString();
          }
        }
      });
    },
    {
      msg: `Are you sure you want to ${
        inActive ? 'Activate' : 'De-Activate'
      } ?`,
    }
  );
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('bureauScoreRate');

  if (rsp.data) {
    const fetchedBureauScoreData: BureauScore[] = rsp.data;

    bureauScore.value = fetchedBureauScoreData;
  }
  fetchingData.value = false;
};

onMounted(async () => {
  loadSource();
});
</script>

<style scoped></style>
