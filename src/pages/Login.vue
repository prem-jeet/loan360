<template>
  <div class="center-screen">
    <div class="row">
      <div class="col gt-xs">
        <div class="justify-center q-px-sm q-mr-md">
          <q-img :src="loginImage" contain spinner-color="white" />
        </div>
      </div>
      <div class="col-sm justify-center column" align="center">
        <q-card
          class="q-pa-sm-md q-ma-xs-xs q-mr-sm-xl q-pl-sm-xs q-pb-xs-md q-pb-sm-none"
          rounded-borders
        >
          <div class="row inline justify-center">
            <div
              id="logo-container"
              class="justify-center q-pa-sm q-pt-lg q-mr-md"
            >
              <q-img :src="logo" spinner-color="white" />
            </div>
            <h3 class="text-weight-medium text-purple-6 text-h3 q-pt-sm-sm">
              Loan 360° Cloud
            </h3>
          </div>
          <q-btn
            push
            color="dark"
            label="login"
            size="xl"
            padding="sm xl"
            @click="login"
            class="q-mt-md justify-center"
          />
        </q-card>
      </div>
    </div>
    <CompanyAndBranchSelectorModal
      v-if="isCompanyAndBranchSelectorModalActive"
    />
  </div>
</template>

<script setup>
import logo from 'src/assets/img/JaguarCloud.png';
import loginImage from 'src/assets/img/loginImage.jpg';
import CompanyAndBranchSelectorModal from 'src/components/modals/CompanyAndBranchSelectorModal.vue';
import { useUserStore } from 'src/stores/user/userStore';
import { getAuthTokenFromAws, login } from 'src/utils/auth/login';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const { selectedBranch, selectedCompany, selectedFinancialYear } =
  storeToRefs(userStore);

const isCompanyAndBranchSelectorModalActive = computed(
  () => route.name === 'authenticated'
);

watch([selectedBranch, selectedCompany, selectedFinancialYear], () => {
  if (
    selectedCompany.value.code &&
    selectedBranch.value.code &&
    selectedFinancialYear.value.id
  ) {
    {
      router.push({ name: 'moduleSelector' });
    }
  }
});

onMounted(async () => {
  if (route.query.code) {
    const rsp = await getAuthTokenFromAws(route.query.code);
    if (rsp.access_token) {
      userStore.setToken({
        id_token: rsp.id_token,
        expires_in: rsp.expires_in,
      });
      userStore.setAccessToken(rsp.access_token);
      router.push({ name: 'authenticated' });
    } else {
      router.push({ name: 'noFound' });
    }
  }
});
</script>

<style lang="scss" scoped>
// #main {
//   overflow: hidden;
// }
#logo-container {
  width: clamp(100px, 50vw, 200px);
}
</style>
