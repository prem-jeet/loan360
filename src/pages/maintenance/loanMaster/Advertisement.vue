<template>
  <div
    class="absolute q-px-md q-pt-md-sm q-pt-xs-md q-pb-md full-width full-height bg-gre-4"
  >
    <BreadCrumbs :ordered-paths="breadcrumbs" :style-css="'q-mx-xs'" />

    <div class="row q-mt-lg q-pb-xl">
      <div class="col">
        <q-table
          :rows="advertisement"
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
                  @click="newEntry"
                  class="full-width"
                />
              </div>
            </div>
            <div class="row full-width q-mt-md">
              <div class="col-12 col-sm-6 col-md-3">
                <q-select
                  outlined
                  dense
                  v-model="filter.mediaId"
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
                    @click="editEntry(props.row.id)"
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
                {{ formatDate(props.row[key], format) }}
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
                      {{ formatDate(props.row[key], format) }}
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
                    @click="editEntry(props.row.id)"
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

  <q-dialog v-model="isEntryModalActive" :maximized="screen.lt.sm">
    <q-card :style="{ minWidth: 'calc(250px + 30vw)' }" class="column">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ mode === 'new' ? 'Add Advertisement' : 'Edit Advertisement' }}
        </div>
        <q-space />
        <q-btn
          @click="isEntryModalActive = false"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-form
        @submit.prevent="saveEntry"
        @reset="setFormData"
        class="col-grow column"
      >
        <q-card-section
          class="q-pa-md col-grow column justify-evenly"
          :style="{ minHeight: '40vh' }"
        >
          <q-select
            outlined
            v-model="newSouce.advertisementMediaId"
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
            v-model="newSouce.name"
            outlined
            no-error-icon
            :error="error"
            :error-message="msg"
            :rules="[(val) => !!val]"
            hide-bottom-space
            label="Name"
          />

          <q-input
            v-model="newSouce.description"
            outlined
            hide-bottom-space
            no-error-icon
            label="Description"
          />

          <q-input outlined v-model="newSouce.date" type="date" />
        </q-card-section>
        <q-card-actions align="center" class="q-py-md bg-grey-2">
          <q-btn
            :label="editingRowId === null ? 'Add' : 'Save '"
            :icon="editingRowId === null ? 'add' : 'save '"
            color="teal"
            type="submit"
            :disable="error"
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
import { ref, onMounted, computed, watch, reactive } from 'vue';
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
  mediaId: number | null;
  name: string | null;
  description: string | null;
  inActive: boolean;
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
const advertisementTemp = ref<Advertisement[]>([]);
const mediaOptions = ref<MediaOptions[]>([]);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const msg = ref('');
const media = ref<number | null>(null);
let mode: 'new' | 'edit' = 'new';
const isEntryModalActive = ref(false);
const format = 'DD/MM/YYYY @hh:mmA';

const filter = reactive<Filter>({
  mediaId: null,
  name: null,
  description: null,
  inActive: false,
});

const newSouce = reactive<Advertisement>({
  name: '',
  description: '',
  id: null,
  inactive: false,
  inactiveOn: '',
  date: '',
  advertisementMediaId: null,
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

const setFormData = () => {
  let temp;
  let dateTemp;
  if (editingRowId.value !== null) {
    let index = advertisement.value.findIndex(
      (obj) => obj.id === editingRowId.value
    );
    temp = advertisement.value[index];
    if (temp.date) {
      const arr = temp.date.split(' ');
      dateTemp = formatDate(arr[0], 'YYYY-MM-DD');
    }
  }

  newSouce.name = temp ? temp.name : '';
  newSouce.advertisementMediaId = temp
    ? temp.advertisementMediaId
    : media.value;
  newSouce.description = temp ? temp.description : '';
  newSouce.date = dateTemp ? dateTemp : '';
  newSouce.id = temp ? temp.id : null;
};

const newEntry = () => {
  mode = 'new';
  editingRowId.value = null;
  setFormData();
  error.value = false;
  msg.value = '';
  isEntryModalActive.value = true;
};

const editEntry = (id: number) => {
  mode = 'edit';
  editingRowId.value = id;
  setFormData();
  isEntryModalActive.value = true;
};

const saveNewEntry = async () => {
  let payLoad = {
    advertisementMediaId: newSouce.advertisementMediaId,
    inactive: false,
    date: newSouce.date,
    description: newSouce.description,
    name: newSouce.name,
  };
  const rsp = await api.post('/advertisement', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    editingRowId.value = null;
    isEntryModalActive.value = false;
  }
};
const saveEdited = async () => {
  const temp = advertisement.value.filter((item) => item.id !== newSouce.id);

  const isDuplicate = temp.find(
    (item) => item.name.toLowerCase() === newSouce.name.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Item alredy exits',
      icon: 'warning',
    });
    return;
  }
  let payLoad = {
    advertisementMediaId: newSouce.advertisementMediaId,
    inactive: false,
    date: newSouce.date,
    description: newSouce.description,
    name: newSouce.name,
    id: newSouce.id,
  };
  const rsp = await api.put('/advertisement/update', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    editingRowId.value = null;
    isEntryModalActive.value = false;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveNewEntry() : saveEdited();
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
    advertisementTemp.value = rsp.data;
    advertisement.value = rsp.data;
  }

  fetchingData.value = false;
};

watch(newSouce, () => {
  if (newSouce.name) {
    error.value = false;
    msg.value = '';

    const temp = advertisement.value.find(
      (item) => item.name.toLowerCase() === newSouce.name.toLocaleLowerCase()
    );

    if (temp && mode == 'new') {
      error.value = true;
      msg.value = 'Item already exists!';
    }
  }
});

watch(media, () => {
  if (media.value) {
    advertisement.value = advertisementTemp.value.filter(
      (temp) => temp.advertisementMediaId === media.value
    );
  } else {
    advertisement.value = advertisementTemp.value;
  }
});

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
