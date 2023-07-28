<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filterdCreditRecommendation"
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
            <div class="row q-gutter-md">
              <div class="col-auto">
                <div class="col-12 text-h6">Credit Recommendation</div>
              </div>
              <div class="col-auto">
                <q-btn label="Add" icon="add" color="primary" />
              </div>
            </div>

            <div class="row q-mt-lg full-width q-mt-sm items-center">
              <div class="col-12 col-sm-6 col-md-4">
                <q-input
                  v-model="filter.code"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Code"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        filter.code = null;
                      } else if (val !== null) {
                        filter.code = filter.code!.toUpperCase();
                      }
                    }
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div
                class="col-12 col-sm-5 col-md-auto q-mt-md q-mt-sm-none q-ml-md-md"
              >
                <div class="flex justify-end items-center">
                  <q-checkbox
                    v-model="filter.conditional"
                    label="Conditional"
                  />
                  <q-checkbox
                    v-model="filter.inActive"
                    label="In-Active"
                    class="q-ml-sm"
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
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
                    @click="changeActive(props.row.code, props.row.inactive)"
                  >
                  </q-btn>
                  <q-btn
                    icon="check"
                    size="xs"
                    outline
                    color="green-10"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="() => saveEdited()"
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
                <span>{{
                  props.row.code.charAt(0).toUpperCase() +
                  props.row.code.slice(1)
                }}</span>
              </q-td>
              <q-td key="name" :props="props">
                <q-input
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="newSouce.name"
                  placeholder="Name required"
                  dense
                  outlined
                  :color="newSouce.name ? 'green' : 'red'"
                  autofocus
                />
                <span v-else>{{
                  props.row.name.charAt(0).toUpperCase() +
                  props.row.name.slice(1)
                }}</span>
              </q-td>
              <q-td key="conditional" :props="props">
                <q-checkbox
                  v-if="editingRowIndex === props.rowIndex"
                  v-model="newSouce.conditional"
                />
                <q-checkbox v-else v-model="props.row.conditional" disable />
              </q-td>
              <q-td key="inactive" :props="props">
                <q-checkbox v-model="props.row.inactive" disable />
              </q-td>
              <q-td
                :key="key"
                :props="props"
                v-for="key in ['createdOn', 'updatedOn', 'inactiveOn']"
              >
                {{ !props.key || formatDate(props.row[key], dateFormat) }}
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
                      <q-input
                        v-if="editingRowIndex === props.rowIndex"
                        v-model="newSouce.name"
                        placeholder="Name required"
                        dense
                        outlined
                        :color="newSouce.name ? 'green' : 'red'"
                        autofocus
                      />
                      <span v-else>{{
                        props.row.name.charAt(0).toUpperCase() +
                        props.row.name.slice(1)
                      }}</span>
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
                        {{ props.colsMap[key].label }}
                      </div>
                      <div class="col-12">
                        {{ formatDate(props.row[key], dateFormat) }}
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
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="sm"
                    color="red"
                    @click="changeActive(props.row.code, props.row.inactive)"
                  >
                  </q-btn>
                  <q-btn
                    label="save"
                    icon="save"
                    size="sm"
                    color="teal"
                    v-if="editingRowIndex === props.rowIndex"
                    @click="() => saveEdited()"
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

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/creditRecommendation',
    label: 'Loan Master',
  },
  {
    path: '/module/maintenance/loanMaster/creditRecommendation',
    label: 'Credit Recommendation',
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
    name: 'conditional',
    required: true,
    align: 'left',
    field: 'conditional',
    label: 'Conditional',
  },
  {
    name: 'inactive',
    required: true,
    align: 'left',
    field: 'inactive',
    label: 'In-active',
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

const dateFormat = 'DD/MM/YYYY @hh:mmA';

interface CreditRecommendation {
  name: string;
  code: string;
  id: number | null;
  createdOn: string;
  inactive: boolean;
  conditional: boolean;
  inactiveOn: string;
  updatedOn: string;
}

interface Filter {
  code: string | null;
  conditional: boolean;
  inActive: boolean;
}

const fetchingData = ref(false);
const name = ref('');
const code = ref('');
const conditional = ref(true);

const creditRecommendation = ref<CreditRecommendation[]>([]);
const creditRecommendationTemp = ref<CreditRecommendation[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const nameError = ref(false);

const filter = reactive<Filter>({
  code: null,
  conditional: true,
  inActive: false,
});

const newSouce = reactive<CreditRecommendation>({
  name: '',
  code: '',
  id: null,
  createdOn: '',
  inactive: false,
  conditional: false,
  inactiveOn: '',
  updatedOn: '',
});

const filteredData = computed(() =>
  creditRecommendation.value.filter((item) => item.inactive === checkBox.value)
);

const filterdCreditRecommendation = computed(() => {
  const { code, conditional, inActive } = filter;
  const data = [...creditRecommendation.value];
  const filteredData = data.filter((item) => {
    const isCodeMatched = !code || item.code.includes(code!);
    const isConditionalMatched = item.conditional === conditional;
    const isInActiveMatched = item.inactive === inActive;

    return isCodeMatched && isConditionalMatched && isInActiveMatched;
  });

  return filteredData;
});

const setFormData = () => {
  const index = creditRecommendation.value.findIndex(
    (obj) => obj.id === editingRowId.value
  );
  newSouce.name = index >= 0 ? creditRecommendation.value[index].name : '';
  newSouce.code = index >= 0 ? creditRecommendation.value[index].code : '';
  newSouce.conditional =
    index >= 0 ? creditRecommendation.value[index].conditional : true;
};

const editEntryConfirmed = (id: number, index: number) => {
  editingRowIndex.value = index;
  editingRowId.value = id;
  setFormData();
};

const editEntry = (id: number, rowIndex: number) => {
  if (isEditing.value) {
    confirmDialog(() => editEntryConfirmed(id, rowIndex), {
      msg: 'Are you sure you want to cancel editing the current Code?',
    });
  } else {
    isEditing.value = true;
    editingRowIndex.value = rowIndex;
    editEntryConfirmed(id, rowIndex);
  }
};
const saveNewEntry = async () => {
  let payLoad = {
    name: name.value,
    code: code.value,
    conditional: conditional.value,
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/creditRecommendation', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    name.value = '';
    code.value = '';
    loadSource();
  }
};
const saveEdited = async () => {
  let payLoad = {
    name: newSouce.name,
    code: newSouce.code,
    conditional: newSouce.conditional,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/creditRecommendation/update', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    isEditing.value = false;
    editingRowIndex.value = null;
    loadSource();
  }
};

const saveEntry = () => {
  if (code.value) {
    name.value ? saveNewEntry() : (nameError.value = true);
  } else {
    error.value = true;
  }
};

const changeActive = async (code: string, state: boolean) => {
  if (editingRowIndex.value === null) {
    confirmDialog(() => changeActiveConfirm(code, state), {
      msg: state
        ? 'Are you sure you want to activate ?'
        : 'Are you sure you want to deactivate ?',
    });
  } else {
    return;
  }
};

const changeActiveConfirm = async (code: string, state: boolean) => {
  const payLoad = {
    code: code,
  };

  const str = state ? 'active' : 'inactive';
  const rsp = await api.put('/creditRecommendation/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('creditRecommendation');

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
    creditRecommendation.value = transformedData;
    creditRecommendationTemp.value = transformedData;
  }
  fetchingData.value = false;
};

onMounted(() => {
  loadSource();
});
</script>

<style scoped></style>
