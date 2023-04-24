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
              <div class="col-xs-12 col-sm-2 col-md-3 q-pr-sm">
                <q-input
                  v-model="name"
                  outlined
                  dense
                  no-error-icon
                  :error="error"
                  :error-message="msg"
                  placeholder="name"
                >
                </q-input>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3">
                <q-input
                  v-model="description"
                  clearable
                  outlined
                  dense
                  hide-bottom-space
                  no-error-icon
                  placeholder="Backward"
                >
                  <template v-slot:after>
                    <q-btn
                      :disable="error"
                      :icon="'add '"
                      color="teal"
                      size="md"
                      @click="saveEntry()"
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
                    :label="props.row.inactive ? 'activate' : 'deactivate'"
                    size="xs"
                    outline
                    color="red"
                    @click="changeActive(props.row.id, props.row.inactive)"
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

              <q-td key="advertisementMediaId" :props="props">
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
                  AdvertisementMedia.find(
                    (item) => item.value === props.row.advertisementMediaId
                  )!.label
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

              <q-td key="description" :props="props">
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
          <!-- <template v-slot:item="props">
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
                <q-card-section>
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Created :</div>
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
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Updated :</div>
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
                  <div class="row q-gutter-y-xs">
                    <div class="col-12 text-weight-medium">Inactive :</div>
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
                    @click="changeActive(props.row.id, props.row.inactive)"
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
          </template> -->
        </q-table>
      </div>
    </div>
  </div>
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
const name = ref('');
const description = ref('');
const nameSearchQuery = ref('');
const descriptionSearchQuery = ref('');
const advertisement = ref<Advertisement[]>([]);
const advertisementTemp = ref<Advertisement[]>([]);
const AdvertisementMedia = ref<AdvertisementMedia[]>([]);
const checkBox = ref(false);
const isEditing = ref(false);
const editingRowIndex = ref<number | null>(null);
const editingRowId = ref<number | null>(null);
const error = ref(false);
const msg = ref('');
const media = ref<number | null>(null);

const newSouce = reactive<Advertisement>({
  name: '',
  description: '',
  id: null,
  inactive: false,
  inactiveOn: '',
  date: '',
  advertisementMediaId: null,
});

const filteredData = computed(() =>
  advertisement.value.filter((item) => item.inactive === checkBox.value)
);

const setFormData = () => {
  const index = advertisement.value.findIndex(
    (obj) => obj.id === editingRowId.value
  );
  newSouce.name = index >= 0 ? advertisement.value[index].name : '';
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
    inactive: false,
    createdOn: new Date(),
  };
  const rsp = await api.post('/advertisementMedia', payLoad);
  if (rsp.data) {
    onSuccess({
      msg: rsp.data.displayMessage,
      icon: 'sync_alt',
    });
    name.value = '';
    loadSource();
  }
};
const saveEdited = async () => {
  const temp = advertisementTemp.value.filter(
    (item) => item.id !== editingRowId.value
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
    name: newSouce.name,
    id: editingRowId.value,
    updatedOn: new Date(),
  };
  const rsp = await api.put('/advertisementMedia/update', payLoad);
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
  if (name.value) {
    saveNewEntry();
  } else {
    error.value = true;
  }
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
  const rsp = await api.put('/advertisementMedia/' + str, payLoad);
  if (rsp.data) {
    onSuccess({ msg: rsp.data.displayMessage });
  }
  loadSource();
};

const loadSource = async () => {
  fetchingData.value = true;
  const rsp = await api.get('advertisement');

  if (rsp.data) {
    advertisement.value = rsp.data.map(
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
    advertisementTemp.value = advertisement.value;
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
    console.log(AdvertisementMedia.value);
  }
  fetchingData.value = false;
};

watch(name, () => {
  error.value = false;
  msg.value = '';

  if (!name.value) {
    return;
  }

  const temp = advertisementTemp.value.find(
    (item) => item.name.toLowerCase() === name.value.toLocaleLowerCase()
  );

  if (temp) {
    error.value = true;
    msg.value = 'Item already exists!';
  }
});

watch(media, () => {
  advertisement.value = advertisementTemp.value.filter(
    (temp) => temp.advertisementMediaId === media.value
  );
});

onMounted(() => {
  loadSource();
  loadadvertisementMedia();
});
</script>

<style scoped></style>
