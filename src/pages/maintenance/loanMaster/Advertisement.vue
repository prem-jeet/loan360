<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="filteredAdvertisement"
          :columns="columns"
          row-key="code"
          :loading="fetchingData"
          table-header-class="bg-deep-purple-10 text-white"
          separator="cell"
          bordered
          title="Nature entry"
          :rows-per-page-options="[0]"
          :hide-bottom="!!advertisement.length"
          :grid="$q.screen.width < 830"
          card-container-class="q-gutter-y-md q-mt-xs"
        >
          <template v-slot:top>
            <div class="row q-gutter-x-md q-gutter-y-sm">
              <div class="col-auto text-h6">Advertisement</div>
              <div class="col-auto">
                <q-btn
                  color="blue-7"
                  icon="add"
                  label="Add new"
                  size="md"
                  @click="
                    editingRowId = null;
                    isAdvertisementFormActive = true;
                  "
                  class="full-width"
                />
              </div>
            </div>
            <div class="row full-width q-mt-md">
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="filter.advertisementMediaId"
                  :options="mediaOptions"
                  map-options
                  emit-value
                  option-label="name"
                  option-value="id"
                  label="Select Media"
                  clear-icon="backspace"
                  dropdown-icon="expand_more"
                  behavior="menu"
                  clearable
                  options-dense
                />
              </div>
            </div>

            <div class="row full-width q-mt-md q-col-gutter-y-sm">
              <div class="col-12 col-sm-5 col-md-2">
                <q-input
                  v-model="filter.name"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Name"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        filter.name = null;
                      }
                    }
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-5 col-md-2 q-ml-sm-md">
                <q-input
                  v-model="filter.description"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="Description"
                  @update:model-value="
                    (val) => {
                      if (val === '') {
                        filter.name = null;
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
                class="col-12 col-md-auto flex items-center justify-end justify-sm-start"
              >
                <q-checkbox v-model="filter.inActive" label=" In-Active" />
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
                      isAdvertisementFormActive = true;
                    "
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

              <q-td key="advertisementMediaId" :props="props">
                {{ resolveMediaName(props.row.advertisementMediaId) }}
              </q-td>

              <q-td
                :key="key"
                :props="props"
                v-for="key in ['name', 'description']"
              >
                {{ props.row[key] && firstLetterCpitalze(props.row[key]) }}
              </q-td>

              <q-td
                :key="key"
                :props="props"
                v-for="key in ['date', 'inactiveOn']"
              >
                {{
                  formatDate(
                    props.row[key],
                    `DD/MM/YYYY ${key === 'date' ? '' : '@hh:mmA'}`
                  )
                }}
              </q-td>
            </q-tr>
          </template>

          <!-- card for grid layout screens < 800px -->
          <template v-slot:item="props">
            <div class="col-xs-12 col-sm-6 q-px-sm-sm">
              <q-card>
                <q-card-section class="q-pb-none">
                  <div class="text-weight-medium">
                    {{ props.colsMap.advertisementMediaId.label }}
                  </div>
                  <div>
                    {{ resolveMediaName(props.row.advertisementMediaId) }}
                  </div>
                </q-card-section>
                <template v-for="key in ['name', 'description']" :key="key">
                  <q-card-section class="q-pb-none" v-if="props.row[key]">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{ firstLetterCpitalze(props.row[key]) }}
                    </div>
                  </q-card-section>
                </template>

                <template v-for="key in ['date', 'inactiveOn']" :key="key">
                  <q-card-section class="q-pb-none" v-if="props.row[key]">
                    <div class="text-weight-medium">
                      {{ props.colsMap[key].label }}
                    </div>
                    <div>
                      {{
                        formatDate(
                          props.row[key],
                          `DD/MM/YYYY ${key === 'date' ? '' : '@hh:mmA'}`
                        )
                      }}
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
                      isAdvertisementFormActive = true;
                    "
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

  <q-dialog
    v-model="isAdvertisementFormActive"
    :maximized="screen.lt.sm"
    @before-hide="editingRowId = null"
    @before-show="setInitialFormData"
  >
    <q-card :style="{ minWidth: 'calc(250px + 30vw)' }" class="column">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ `${editingRowId ? 'Edit' : 'New'} Advertisement` }}
        </div>
        <q-space />
        <q-btn
          @click="isAdvertisementFormActive = false"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-form
        @submit.prevent="handleAdvertisementFormSubmit"
        @reset="setInitialFormData"
        class="col-grow column"
      >
        <q-card-section
          class="q-pa-md col-grow column justify-evenly"
          :style="{ minHeight: '40vh' }"
        >
          <q-select
            outlined
            v-model="newAdvertisement.advertisementMediaId"
            :options="mediaOptions"
            map-options
            emit-value
            option-label="name"
            option-value="id"
            no-error-icon
            label="Select media"
            :rules="[(val) => !!val]"
            clear-icon="backspace"
            dropdown-icon="expand_more"
            behavior="menu"
            options-dense
            hide-bottom-space
          />

          <q-input
            v-model="newAdvertisement.name"
            outlined
            no-error-icon
            :rules="[(val) => !!val]"
            hide-bottom-space
            label="Name"
          />

          <q-input
            v-model="newAdvertisement.description"
            outlined
            hide-bottom-space
            no-error-icon
            label="Description"
          />

          <q-input outlined v-model="newAdvertisement.date" type="date" />
        </q-card-section>
        <q-card-actions align="center" class="q-py-md bg-grey-2">
          <q-btn
            :label="editingRowId === null ? 'Add' : 'Save '"
            :icon="editingRowId === null ? 'add' : 'save '"
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

import { usePut, usePost } from 'src/composables/apiCalls';
import { ref, onMounted, computed, reactive } from 'vue';
import { onSuccess, confirmDialog, onFailure } from 'src/utils/notification';
import { firstLetterCpitalze } from 'src/utils/string';
import { formatDate } from 'src/utils/date';
import { useQuasar } from 'quasar';

interface Advertisement {
  name: string;
  description: string;
  id: number | null;
  inactive: boolean;
  inactiveOn: string;
  date: string;
  advertisementMediaId: number | null;
}

interface MediaOptions {
  id: number;
  name: string;
  createdOn: string | null;
  updatedOn: string | null;
  inactive: boolean;
  inactiveOn: string | null;
}

interface Filter {
  advertisementMediaId: number | null;
  name: string | null;
  description: string | null;
  inActive: boolean;
}

interface AdvertisementForm {
  id?: number;
  advertisementMediaId: number | null;
  name: string | null;
  description: string | null;
  date: string | null;
}

const breadcrumbs = [
  { path: '/module/maintenance', label: 'Maintenance' },
  {
    path: '/module/maintenance/loanMaster/advertisement',
    label: 'Loan Master',
  },
  {
    path: '/module/maintenance/loanMaster/advertisement',
    label: 'Advertisement',
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
    name: 'advertisementMediaId',
    required: true,
    align: 'left',
    field: 'advertisementMediaId',
    label: 'Media',
  },
  {
    name: 'name',
    required: true,
    align: 'left',
    field: 'name',
    label: 'Name',
  },
  {
    name: 'description',
    required: true,
    align: 'left',
    field: 'description',
    label: 'Description',
  },
  {
    name: 'date',
    required: true,
    align: 'left',
    field: 'date',
    label: 'Date',
  },

  {
    name: 'inactiveOn',
    required: true,
    align: 'left',
    field: 'inactiveOn',
    label: 'In-Active On',
  },
];

const { screen } = useQuasar();
const fetchingData = ref(false);
const advertisement = ref<Advertisement[]>([]);
const mediaOptions = ref<MediaOptions[]>([]);
const editingRowId = ref<number | null>(null);
const isAdvertisementFormActive = ref(false);

const filter = reactive<Filter>({
  advertisementMediaId: null,
  name: null,
  description: null,
  inActive: false,
});

const newAdvertisement = ref<AdvertisementForm>({
  advertisementMediaId: null,
  name: null,
  description: null,
  date: null,
});

const filteredAdvertisement = computed(() => {
  const data = [...advertisement.value];

  const { advertisementMediaId, name, description, inActive } = filter;

  const filteredData = data.filter((item) => {
    const isMedaiIdMatched =
      !advertisementMediaId ||
      item.advertisementMediaId === advertisementMediaId;
    const isNameMatched =
      !name || item.name.toLocaleLowerCase().includes(name.toLowerCase());

    const isDescriptiondMatched =
      !description ||
      (item.description &&
        item.description
          .toLocaleLowerCase()
          .includes(description.toLowerCase()));

    const isInActiveMatched = inActive === item.inactive;

    return (
      isMedaiIdMatched &&
      isNameMatched &&
      isDescriptiondMatched &&
      isInActiveMatched
    );
  });

  return filteredData;
});

const initialFormData = computed(() => {
  const temp: AdvertisementForm = {
    advertisementMediaId: null,
    name: null,
    description: null,
    date: null,
  };

  if (editingRowId.value) {
    const editingRow = filteredAdvertisement.value.find(
      (advertisement) => advertisement.id === editingRowId.value
    );
    if (editingRow) {
      temp.advertisementMediaId = editingRow.advertisementMediaId;
      temp.name = editingRow.name;
      temp.description = editingRow.description;
      temp.date = editingRow.date;
    }
  }

  return temp;
});

const resolveMediaName = (id: number) => {
  const media = mediaOptions.value.find((media) => {
    return media.id === id;
  });
  if (media) {
    return media.name;
  }
  return '';
};

const setInitialFormData = () =>
  (newAdvertisement.value = { ...initialFormData.value });

const handleAdvertisementFormSubmit = async () => {
  const payload = { ...newAdvertisement.value };

  let rsp;

  if (!editingRowId.value) {
    rsp = await usePost('/advertisement', payload);
  } else {
    payload.id = editingRowId.value;
    rsp = await usePut('/advertisement/update', payload);
  }

  if (rsp) {
    isAdvertisementFormActive.value = false;
    loadSource();
  }
};

const changeActive = async (id: number, state: boolean) => {
  if (editingRowId.value === null) {
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
  const rsp = await api.put('/advertisement/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('advertisement');

  if (rsp.data) {
    advertisement.value = rsp.data;
  }

  fetchingData.value = false;
};

onMounted(async () => {
  /* replace with useFetch */
  try {
    const rsp = await api.get('advertisementMedia');

    if (rsp.data) {
      mediaOptions.value = rsp.data;
      loadSource();
    }
  } catch (e) {
    onFailure({ msg: 'Unanle to fetch Media options' });
  }
});
</script>

<style scoped></style>
