<template>
  <q-card>
    <q-card-section class="row items-center bg-blue-6 text-black">
      <div class="text-h6">Address</div>
      <q-space />
      <q-btn
        icon="restart_alt"
        text-color="white"
        round
        color="indigo-10"
        @click="reset"
      />
    </q-card-section>
    <q-card-section>
      <div
        class="row q-gutter-x-lg q-gutter-y-md justify-xs-center justify-sm-evenly"
      >
        <div class="col-xs-10 col-sm-5 col-lg-5 q-gutter-y-md">
          <div class="row">
            <div class="col">
              <q-input v-model="address.name" label="Name" outlined dense />
            </div>
          </div>
          <div class="row q-gutter-y-sm">
            <div
              class="col-12"
              v-for="item in new Array(3).fill(0).map((item, index) => ({
                key: `address${index + 1}`,
                label: `Address ${index + 1}`,
              }))"
              :key="item.key"
            >
              <q-input
                v-model="address[item.key as keyof Address]"
                :label="item.label"
                outlined
                dense
              />
            </div>
          </div>
          <div class="row q-gutter-y-sm">
            <div class="col-12">
              <q-input
                v-model="address.city"
                label="City"
                outlined
                dense
                :error="!address.city"
                hide-bottom-space
                no-error-icon
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="address.countryId"
                label="Country"
                outlined
                dense
                :error="address.countryId === null"
                hide-bottom-space
                no-error-icon
                :options="countries"
                emit-value
                map-options
                option-label="name"
                option-value="id"
                behavior="menu"
                options-dense
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="address.stateId"
                label="State"
                outlined
                dense
                :error="address.stateId === null"
                hide-bottom-space
                no-error-icon
                :options="states"
                emit-value
                map-options
                option-label="name"
                option-value="id"
                behavior="menu"
                options-dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model.number="address.pincode"
                label="Pincode"
                outlined
                dense
                hide-bottom-space
                no-error-icon
                mask="###########"
              />
            </div>
          </div>
        </div>
        <div class="col-xs-10 col-sm-5 col-lg-5 q-gutter-y-md">
          <div class="row">
            <div class="col">
              <q-input
                label="STD"
                v-model="address.std"
                dense
                outlined
                no-error-icon
                :rules="[testStdCode]"
              />
            </div>
          </div>
          <div class="row q-mt-none q-gutter-y-sm">
            <div class="col-12">
              <div class="row q-gutter-x-sm">
                <div class="col">
                  <q-input
                    mask="##########"
                    v-model.number="address.phone1"
                    label="Phone 1"
                    dense
                    outlined
                  />
                </div>
                <div class="col-3">
                  <q-input
                    mask="#####"
                    v-model.number="address.phone1Extn"
                    label="Ext"
                    dense
                    outlined
                  />
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row q-gutter-x-sm">
                <div class="col">
                  <q-input
                    mask="##########"
                    v-model.number="address.phone2"
                    label="Phone 2"
                    dense
                    outlined
                  />
                </div>
                <div class="col-3">
                  <q-input
                    mask="#####"
                    v-model.number="address.phone2Extn"
                    label="Ext"
                    dense
                    outlined
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model.number="address.mobile"
                mask="#############"
                dense
                outlined
                label="Mobile"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input
                v-model.number="address.fax"
                mask="##########"
                dense
                outlined
                label="Fax no."
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { computed, onMounted, reactive, ref, watch } from 'vue';

interface Address {
  address1: string | null;
  address2: string | null;
  address3: string | null;
  city: string | null;
  countryId: number | null;
  fax: string | null;
  mobile: string | null;
  name: string | null;
  phone1: string | null;
  phone1Extn: string | null;
  phone2: string | null;
  phone2Extn: string | null;
  pincode: string | null;
  stateId: number | null;
  std: string | null;
  id: string | null;
  cityId: string | null;
  geoLocation: string | null;
}

interface Props {
  modelValue: Address;
  addressId?: number | null;
  resetForm?: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue', 'onReset']);

const isRessseting = ref(false);
const initialData = ref<Address>({ ...props.modelValue });
const address = reactive<Address>(props.modelValue);
const countries = ref<{ id: number; name: string }[]>([]);
const states = ref<{ id: number; name: string }[]>([]);
const shouldReset = computed(() => props.resetForm);
const testStdCode = (value: string) => {
  const regex = /^[-+\d]*$/;
  if (![null, ''].includes(value)) {
    if (value.length > 7) {
      address.std = address.std!.slice(0, 7);
    }
    if (!regex.test(value)) {
      address.std = null;
      return 'Only numbers, plus and minus signs are allowed';
    }
  }
  return true;
};
const reset = () => {
  isRessseting.value = address.countryId !== initialData.value.countryId;
  let key: keyof Address;
  for (key in initialData.value) {
    // @ts-expect-error intended iteration
    address[key] = initialData.value[key];
  }
};

const fetchAddress = async (addressId: number) => {
  try {
    const rsp = await api.get(`address/${addressId}`);
    if (rsp.data) {
      return rsp.data;
    }
  } catch (e) {
    return {};
  }
};

watch(shouldReset, () => {
  if (shouldReset.value) {
    reset();
    emits('onReset');
  }
});

watch(address, () => {
  emits('update:modelValue', address);
});

watch(
  () => address.countryId,
  async () => {
    const { countryId } = address;

    if (countryId !== null) {
      if (!isRessseting.value) {
        address.stateId = null;
      }
      const rsp = await api.get(`statesByCountry/${countryId}`);
      if (rsp.data) {
        states.value = [...rsp.data];
      }
      isRessseting.value = false;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  const rsp = await api.get('country');
  if (rsp.data) {
    countries.value = rsp.data;
  }

  initialData.value = { ...props.modelValue };
  if (props.addressId) {
    const rsp = await fetchAddress(props.addressId);
    if (rsp.countryId) {
      initialData.value = { ...rsp };

      let KEY: keyof Address;
      for (KEY in initialData.value) {
        // @ts-expect-error intentive overrite
        address[KEY] = initialData.value[KEY];
      }
    }
  }
});
</script>
