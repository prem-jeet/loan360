<template>
  <div class="absolute q-pa-md full-width full-height bg-gre-4">
    <q-chip outline square size="md" class="shadow-4" :ripple="false">
      <BreadCrumbs :ordered-paths="breadcrumbs" />
    </q-chip>

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
                  <div class="col-auto text-h6">Advertisement</div>
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
            <div class="row full-width q-pb-md">
              <div class="col-xs-12 col-sm-3 col-md-2">
                <q-select
                  outlined
                  dense
                  v-model="media"
                  :options="AdvertisementMedia"
                  map-options
                  menu-shrink
                  emit-value
                  label="Select Media"
                />
              </div>
            </div>

            <div class="row full-width q-col-gutter-y-md">
              <div class="col-xs-12 col-sm-2 col-md-2">
                <q-input
                  v-model="nameSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="name"
                  @clear="nameSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-2 col-md-2 q-pl-xs">
                <q-input
                  v-model="descriptionSearchQuery"
                  outlined
                  clearable
                  dense
                  rounded
                  placeholder="description"
                  @clear="descriptionSearchQuery = ''"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-2">
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

              <q-td key="advertisementMediaId" :props="props">
                <span>{{
                  AdvertisementMedia.find(
                    (item) => item.value === props.row.advertisementMediaId
                  )!.label
                }}</span>
              </q-td>
              <q-td key="name" :props="props">
                <span>{{
                  props.row.name.charAt(0).toUpperCase() +
                  props.row.name.slice(1)
                }}</span>
              </q-td>

              <q-td key="description" :props="props">
                <span>{{
                  props.row.description.charAt(0).toUpperCase() +
                  props.row.description.slice(1)
                }}</span>
              </q-td>
              <q-td key="date" :props="props">
                {{ props.row.date.toLocaleString('en-US', DateTimeOptions) }}
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
                    <div class="col-12 text-weight-medium">Media :</div>
                    <div class="col-12">
                      <span>{{
                        AdvertisementMedia.find(
                          (item) =>
                            item.value === props.row.advertisementMediaId
                        )!.label
                      }}</span>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Name :</div>
                    <div class="col-12">
                      {{
                        props.row.name.charAt(0).toUpperCase() +
                        props.row.name.slice(1)
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Description :</div>
                    <div class="col-12">
                      {{
                        props.row.description.charAt(0).toUpperCase() +
                        props.row.description.slice(1)
                      }}
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Date :</div>
                    <div class="col-12">
                      {{
                        props.row.date.toLocaleString('en-US', DateTimeOptions)
                      }}
                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">InactiveOn :</div>
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

                <q-card-actions align="center" class="q-py-md bg-grey-2">
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
              mode === 'new' ? 'Add Advertisement' : 'Edit Advertisement'
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
            <div class="col-12 q-mt-sm">
              <q-select
                outlined
                dense
                v-model="newSouce.advertisementMediaId"
                :options="AdvertisementMedia"
                map-options
                menu-shrink
                emit-value
                :error="selectError"
                label="Select media"
              />
            </div>
            <div class="col-12">
              <div class="col-12 q-mt-sm">
                <q-input
                  v-model="newSouce.name"
                  outlined
                  dense
                  no-error-icon
                  :error="error"
                  :error-message="msg"
                  placeholder="name"
                >
                </q-input>
              </div>
              <div class="col-12 q-mt-sm">
                <q-input
                  v-model="newSouce.description"
                  clearable
                  outlined
                  dense
                  hide-bottom-space
                  no-error-icon
                  placeholder="description"
                >
                </q-input>
              </div>
              <div class="col-12 q-mt-sm">
                <q-input outlined v-model="newSouce.date" type="date" dense />
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

interface Advertisement {
  name: string;
  description: string;
  id: number | null;
  inactive: boolean;
  inactiveOn: string;
  date: string;
  advertisementMediaId: number | null;
}

interface AdvertisementMedia {
  label: string;
  value: number | null;
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

const fetchingData = ref(false);
const nameSearchQuery = ref('');
const descriptionSearchQuery = ref('');
const advertisement = ref<Advertisement[]>([]);
const advertisementTemp = ref<Advertisement[]>([]);
const AdvertisementMedia = ref<AdvertisementMedia[]>([]);
const checkBox = ref(false);
const editingRowIndex = ref<number | null>(null);
const error = ref(false);
const selectError = ref(false);
const msg = ref('');
const media = ref<number | null>(null);
let mode: 'new' | 'edit' = 'new';
const isEntryModalActive = ref(false);

const newSouce = reactive<Advertisement>({
  name: '',
  description: '',
  id: null,
  inactive: false,
  inactiveOn: '',
  date: '',
  advertisementMediaId: null,
});

const filteredData = computed(() => {
  const _nameSearchQuery = nameSearchQuery.value?.toLocaleLowerCase() || '';
  const _descriptionSearchQuery =
    descriptionSearchQuery.value?.toLocaleLowerCase() || '';

  return advertisement.value.filter((item) => {
    const namePresent = item.name
      .toLocaleLowerCase()
      .includes(_nameSearchQuery);
    const descriptionPresent = item.description
      .toLocaleLowerCase()
      .includes(_descriptionSearchQuery);

    if (_nameSearchQuery && _descriptionSearchQuery) {
      return namePresent && descriptionPresent;
    }

    if (_nameSearchQuery) {
      return namePresent;
    }

    if (_descriptionSearchQuery) {
      return descriptionPresent;
    }

    return true;
  });
});

const setFormData = () => {
  let temp;
  let date;
  if (editingRowIndex.value !== null) {
    temp = advertisement.value[editingRowIndex.value];
    if (temp.date) {
      let tempDate = new Date(temp.date);
      date = `${tempDate.getFullYear()}-${(tempDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`;
    }
  }

  newSouce.name = temp ? temp.name : '';
  newSouce.advertisementMediaId = temp
    ? temp.advertisementMediaId
    : media.value;
  newSouce.description = temp ? temp.description : '';
  newSouce.date = date ? date : '';
  newSouce.id = temp ? temp.id : null;
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
    loadadvertisementMedia();
    editingRowIndex.value = null;
    isEntryModalActive.value = false;
  }
};
const saveEdited = async () => {
  const temp = advertisementTemp.value.filter(
    (item) => item.id !== newSouce.id
  );

  const isDuplicate = temp.find(
    (item) => item.name.toLowerCase() === newSouce.name.toLowerCase()
  );
  if (isDuplicate) {
    onFailure({
      msg: 'Duplicate Account Found',
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
    editingRowIndex.value = null;
    loadadvertisementMedia();
    isEntryModalActive.value = false;
  }
};

const saveEntryConfirm = () => {
  if (newSouce.name && newSouce.advertisementMediaId) {
    saveNewEntry();
  } else if (!newSouce.advertisementMediaId) {
    selectError.value = true;
  } else {
    error.value = true;
  }
};

const saveEntry = () => {
  mode === 'new' ? saveEntryConfirm() : saveEdited();
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
  const rsp = await api.put('/advertisement/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadadvertisementMedia();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('advertisement');

  if (rsp.data) {
    const transformedData = rsp.data.map(
      (item: {
        date: string | number | Date;
        inactiveOn: string | number | Date;
        description: string | null;
      }) => {
        return {
          ...item,
          date: item.date !== null ? new Date(item.date) : '',
          inactiveOn: item.inactiveOn !== null ? new Date(item.inactiveOn) : '',
          description: item.description ? item.description : '',
        };
      }
    );
    advertisement.value = transformedData.filter(
      (item: { inactive: boolean }) => item.inactive === checkBox.value
    );
    if (media.value) {
      advertisement.value = advertisement.value.filter(
        (item) => item.advertisementMediaId === media.value
      );
    }
    advertisementTemp.value = transformedData;
  }
  fetchingData.value = false;
};

const loadadvertisementMedia = async () => {
  fetchingData.value = true;
  const rsp = await api.get('advertisementMedia');

  if (rsp.data) {
    AdvertisementMedia.value = rsp.data.map(
      (item: { id: number | null; name: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      }
    );
    loadSource();
  }
  fetchingData.value = false;
};

watch(newSouce, () => {
  if (newSouce.name) {
    error.value = false;
    msg.value = '';

    if (!newSouce.name) {
      return;
    }

    const temp = advertisementTemp.value.find(
      (item) => item.name.toLowerCase() === newSouce.name.toLocaleLowerCase()
    );

    if (temp && mode == 'new') {
      error.value = true;
      msg.value = 'Item already exists!';
    }
  }
});

watch(media, () => {
  advertisement.value = advertisementTemp.value.filter(
    (temp) => temp.advertisementMediaId === media.value
  );
});
watch(checkBox, () => {
  advertisement.value = advertisementTemp.value.filter((item) => {
    return item.inactive === checkBox.value;
  });
  if (media.value) {
    advertisement.value = advertisement.value.filter(
      (item) => item.advertisementMediaId === media.value
    );
  }
});

watch(newSouce, () => {
  if (newSouce.advertisementMediaId) {
    selectError.value = false;
  }
});

onMounted(() => {
  loadadvertisementMedia();
});
</script>

<style scoped></style>
