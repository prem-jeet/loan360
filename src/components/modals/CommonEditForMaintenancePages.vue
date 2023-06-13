<template>
  <q-card style="width: 400px">
    <q-form @submit.prevent="saveEdit" @reset="resetForm">
      <q-card-section class="bg-grey-2">
        <div class="flex items-center">
          <span class="text-subtitle2 q-mr-xl"> {{ editMsg }} </span>
          <q-space />
          <q-btn
            class="q-ml-xs-md q-ml-sm-xl"
            icon="close"
            @click="close"
            flat
          />
        </div>
      </q-card-section>
      <q-card-section class="q-px-lg q-py-sm">
        <div class="row">
          <div class="col-12 q-mt-sm">
            <q-input
              outlined
              v-model="modalObj.firstInputValue"
              :label="modalObj.firstInputLabel"
              dense
              :rules="[(val: string) => val !== '']"
            />
          </div>
        </div>
        <div class="row q-mb-md" v-show="modalObj.secondInputLabel">
          <div class="col-12 q-mt-sm">
            <q-input
              outlined
              v-model="modalObj.secondInputValue"
              :label="modalObj.secondInputLabel"
              dense
            />
          </div>
        </div>

        <div class="row items-center">
          <div class="col-6">
            <q-checkbox
              v-model="modalObj.inactive"
              :label="modalObj.inactive ? 'Activate' : 'Deactivate'"
              @click="active = !active"
            />
          </div>
          <div class="col-6 text-right text-warning">
            {{
              editObject.inactive
                ? 'Currently Deactivate'
                : 'Currently Activate'
            }}
          </div>
        </div>
        <div v-if="active">
          <div class="row q-mt-md bg-yellow-2">
            <div class="col-12 q-pl-md q-py-sm">
              <span> <q-icon name="warning" color="warning" /></span>
              <span class="text-red-10 q-pl-sm">
                {{
                  modalObj.inactive
                    ? 'It will be deactivated, Click save to confirm'
                    : 'It will be activated, Click save to confirm'
                }}
              </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator class="q-mt-md" />
      <q-card-actions align="center" class="q-py-md bg-grey-2 q-mt-auto">
        <q-btn label="Save" icon="save" color="teal" type="submit" />
        <q-btn label="Reset" color="red-5" type="reset" icon="refresh" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
interface EditObject {
  firstInputValue: string;
  firstInputLabel: string;
  secondInputValue?: string;
  secondInputLabel?: string;
  inactive: boolean;
}

const props = defineProps({
  editObject: {
    type: Object as () => EditObject,
    required: true,
  },
  editMsg: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'saveEdit']);
let modalObj = reactive<EditObject>({ ...props.editObject });

const active = ref(false);

const close = () => {
  emit('close');
};

const resetForm = () => {
  modalObj.firstInputValue = props.editObject.firstInputValue;
  modalObj.secondInputValue = props.editObject.secondInputValue;
  modalObj.inactive = props.editObject.inactive;
};

const saveEdit = () => {
  emit('saveEdit', modalObj);
  resetForm();
};
</script>

<style scoped></style>
