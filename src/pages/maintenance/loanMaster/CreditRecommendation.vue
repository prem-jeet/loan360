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
          :hide-bottom="!!filterdCreditRecommendation.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-md">
              <div class="col-auto">
                <div class="col-12 text-h6">Credit Recommendation</div>
              </div>
              <div class="col-auto">
                <q-btn
                  label="Add"
                  icon="add"
                  color="primary"
                  @click="
                    editingRowCode = null;
                    isFormActive = true;
                  "
                />
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
                    @click="
                      editingRowCode = props.row.code;
                      isFormActive = true;
                    "
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
                </q-btn-group>
              </q-td>
              <q-td key="code" :props="props">
                {{ props.row.code }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="conditional" :props="props">
                <q-icon name="check" />
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
                    <div class="col-12 text-weight-medium">Code :</div>
                    <div class="col-12">
                      {{ props.row.code }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      {{ props.row.name }}
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
                    @click="
                      editingRowCode = props.row.code;
                      isFormActive = true;
                    "
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
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog
      v-model="isFormActive"
      @before-hide="editingRowCode = null"
      @before-show="setFormData"
    >
      <q-card style="width: 500px">
        <q-form @submit.prevent="handleFormSubmit" @reset="setFormData">
          <q-card-section class="bg-grey-2">
            <div class="flex items-center">
              <span class="text-bold q-mr-xl">
                {{ `${editingRowCode ? 'Edit' : 'Add'} Credit Recommendation` }}
              </span>
              <q-space />
              <q-btn
                class="q-ml-xs-md q-ml-sm-xl"
                icon="close"
                flat
                @click="isFormActive = false"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="formData.code"
              outlined
              label="Code"
              hide-bottom-space
              no-error-icon
              :error="formData.code === null"
              :rules="[(val) => val !== null]"
              @update:model-value="
                    (val) => {
                      if (val === '') {
                        formData.code = null;
                      } else if (val !== null) {
                        formData.code = formData.code!.toUpperCase();
                      }
                    }"
            />
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="formData.name"
              outlined
              label="Name"
              hide-bottom-space
              no-error-icon
              :error="formData.name === null"
              :rules="[(val) => val !== null]"
              @update:model-value="
                (val) => {
                  if (val === '') {
                    formData.name = null;
                  } else if (val !== null) {
                    formData.name = capitalCase(formData.name!);
                  }
                }
              "
            />
          </q-card-section>
          <q-card-section>
            <q-checkbox v-model="formData.conditional" label="Conditional" />
          </q-card-section>
          <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
            <q-btn
              :label="editingRowCode ? 'Save' : 'Add '"
              :icon="editingRowCode ? 'save' : 'add '"
              color="teal"
              type="submit"
            />
            <q-btn label="Reset" color="red-5" type="reset" icon="refresh" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from 'src/types/Common';
import { api } from 'src/boot/axios';
import BreadCrumbs from 'src/components/ui/BreadCrumbs.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue';
import { onSuccess, confirmDialog, alertDialog } from 'src/utils/notification';
import { formatDate } from 'src/utils/date';
import { capitalCase } from 'src/utils/string';
import { useFetch } from 'src/composables/apiCalls';

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

const columns: TableColumn[] = [
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
    align: 'center',
    field: 'conditional',
    label: 'Conditional',
  },
  {
    name: 'inactive',
    required: true,
    align: 'center',
    field: 'inactive',
    label: 'In-active',
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

const dateFormat = 'DD/MM/YYYY @hh:mmA';

interface CreditRecommendation {
  name: string | null;
  code: string | null;
  conditional: boolean | null;
  inactive: boolean | null;
  createdOn: string | null;
  inactiveOn: string | null;
  updatedOn: string | null;
}
interface Form {
  name: string | null;
  code: string | null;
  conditional: boolean;
}
interface Filter {
  code: string | null;
  conditional: boolean;
  inActive: boolean;
}

const fetchingData = ref(false);

const isFormActive = ref(false);
const creditRecommendation = ref<CreditRecommendation[]>([]);

const editingRowIndex = ref<number | null>(null);

const editingRowCode = ref<string | null>(null);
const formData = ref<Form>({
  code: null,
  name: null,
  conditional: true,
});

const filter = reactive<Filter>({
  code: null,
  conditional: true,
  inActive: false,
});

const filterdCreditRecommendation = computed(() => {
  const { code, conditional, inActive } = filter;
  const data = [...creditRecommendation.value];
  const filteredData = data.filter((item) => {
    const isCodeMatched = !code || item.code!.includes(code!);
    const isConditionalMatched = item.conditional === conditional;
    const isInActiveMatched =
      item.inactive == inActive || item.inactive === null;

    return isCodeMatched && isConditionalMatched && isInActiveMatched;
  });

  return filteredData;
});

const initialFormData = computed(() => {
  const temp: Form = {
    code: null,
    name: null,
    conditional: true,
  };

  if (editingRowCode.value) {
    const editingRow = creditRecommendation.value.find(
      (item) => item.code === editingRowCode.value
    );
    if (editingRow) {
      temp.code = editingRow.code;
      temp.name = editingRow.name;
      temp.conditional =
        editingRow.conditional === null || editingRow.conditional;
    }
  }

  return temp;
});
const setFormData = () => {
  formData.value = { ...initialFormData.value };
};

const isCodeDuplicate = (code: string) => {
  const isDuplicate = !!creditRecommendation.value.some((item) => {
    return (
      item.code === code &&
      !(editingRowCode.value && editingRowCode.value === item.code)
    );
  });

  return isDuplicate;
};

const handleFormSubmit = async () => {
  if (formData.value.code && isCodeDuplicate(formData.value.code)) {
    alertDialog('Duplicate Code');
    return;
  }

  const payload: Partial<CreditRecommendation> = {
    ...formData.value,
  };

  if (!editingRowCode.value) {
    payload.inactive = false;
  }
  const method = editingRowCode.value ? 'put' : 'post';
  const endpoint = `/creditRecommendation/${
    editingRowCode.value ? 'update' : ''
  }`;

  const rsp = await api[method](endpoint, payload);
  if (rsp.data) {
    loadCreditRecommendation();
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
  loadCreditRecommendation();
};

const loadCreditRecommendation = async () => {
  fetchingData.value = true;
  const rsp = await useFetch('creditRecommendation');

  if (rsp) {
    creditRecommendation.value = rsp as CreditRecommendation[];
  }
  fetchingData.value = false;
};

onMounted(() => {
  loadCreditRecommendation();
});
</script>

<style scoped></style>
