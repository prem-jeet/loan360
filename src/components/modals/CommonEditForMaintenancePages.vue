<template>
  <q-card style="width: 400px">
    <q-form>
      <q-card-section class="bg-grey-2">
        <div class="flex items-center">
          <span class="text-subtitle2 q-mr-xl"> Edit Source </span>
          <q-space />
          <q-btn class="q-ml-xs-md q-ml-sm-xl" icon="close" flat />
        </div>
      </q-card-section>
      <q-card-section class="q-px-lg q-py-sm">
        <div class="row">
          <div class="col-12 q-mt-sm">
            <q-input
              outlined
              v-model="modalObj.name"
              label="name"
              dense
              :rules="[(val:string) => val!=='']"
            />
          </div>
        </div>
        <div class="row justify-between q-mx-sm">
          <div class="col-4">
            <q-btn
              :label="modalObj.inactive ? 'activate' : 'deactivate'"
              size="xs"
              outline
              color="red"
            ></q-btn>
          </div>
          <div class="col-4 text-right text-warning">
            {{
              modalObj.inactive ? 'Currently Deactive' : 'Currently Activate'
            }}
          </div>
        </div>
        <div class="row q-mt-md bg-yellow-2">
          <div class="col-12 q-pl-md q-py-sm">
            <span> <q-icon name="warning" color="warning" /></span>
            <span class="text-red-10 q-pl-sm">
              {{
                modalObj.inactive
                  ? 'Are you sure you want to activate ?'
                  : 'Are you sure you want to deactivate ?'
              }}
            </span>
          </div>
        </div>
        <div class="row q-mt-md justify-center text-center">
          <div class="col-3">
            <q-btn label="ok" color="teal"></q-btn>
          </div>
          <div class="col-3"><q-btn label="no" color="red-5"></q-btn></div>
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
import { reactive } from 'vue';
interface EditObject {
  name: string;
  inactive: boolean;
}

const props = defineProps({
  editObject: {
    type: Object as () => EditObject,
    required: true,
  },
});

const modalObj = reactive<EditObject>({ ...props.editObject });
</script>

<style scoped></style>
