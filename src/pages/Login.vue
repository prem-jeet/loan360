<template>
  <div
    class="overflow-hidden main"
    :style="{ background: screenWidth < 750 ? '#f6f6f6' : '#fefeff' }"
  >
    <div
      class="q-pa-lg full-height full-width flex flex-center"
      v-if="screenWidth < 750"
    >
      <div style="transform: translateY(-1vh)" class="full-width flex-column">
        <div
          class="column flex-center q-mx-auto"
          style="transform: scale(0.7); max-width: 500px; min-width: 300px"
        >
          <q-img :src="logo" spinner-color="white" />

          <span
            brand-text
            class="text-weight-medium text-blue-10 q-mt-lg"
            style="letter-spacing: 1px"
          >
            Loan 360° Cloud
          </span>
        </div>
        <div class="q-pa-md q-pt-none q-mb-xl">
          <q-btn
            label="Login"
            class="full-width"
            @click="login"
            size="lg"
            id="login-button"
          />
        </div>
      </div>
    </div>
    <div v-else class="full-height full-width row">
      <div class="col-6">
        <q-img :src="loginImage" height="100vh" spinner-color="white" />
      </div>
      <div class="col-6 flex flex-center">
        <div style="transform: translateY(-1vh)" class="full-width flex-column">
          <div
            class="column flex-center q-mx-auto"
            style="transform: scale(0.6); max-width: 500px"
          >
            <q-img
              :src="logo"
              spinner-color="white"
              style="transform: scale(0.9)"
            />

            <span
              class="text-weight-medium text-blue-10"
              style="letter-spacing: 1px"
              brand-text
            >
              Loan 360° Cloud
            </span>
          </div>
          <div class="q-px-md q-pt-none q-mb-xl flex flex-center">
            <q-btn
              style="max-width: 500px"
              label="Login"
              class="full-width"
              @click="login"
              size="lg"
              id="login-button-desktop"
            />
          </div>
        </div>
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
import { useScreenSize } from 'src/composables/utilComposibles';
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const { screenWidth } = useScreenSize();

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
// #logo-container {
//   width: clamp(100px, 50vw, 200px);
// }
.main {
  width: 100vw;
  height: 100vh;
}

#login-button {
  -webkit-border-radius: 12px;
  border-radius: 12px;
  background: #f6f6f6;
  -webkit-box-shadow: 5px 5px 12px #e5e5e5, -5px -5px 12px #ffffff;
  box-shadow: 5px 5px 12px #e5e5e5, -5px -5px 12px #ffffff;
}

#login-button-desktop {
  -webkit-border-radius: 12px;
  border-radius: 12px;
  background: #ffffff;
  -webkit-box-shadow: 5px 5px 12px #ededed, -5px -5px 12px #ffffff;
  box-shadow: 5px 5px 12px #ededed, -5px -5px 12px #ffffff;
}

[brand-text] {
  font-size: calc(var(--c-font-size) + 2.5vw);
}
</style>
