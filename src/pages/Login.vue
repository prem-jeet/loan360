<template>
  <div>
    <div id="main" class="fullscreen child-take-fullheight bg-grey-1">
      <div id="main-content" class="column flex-center q-pa-md-md">
        <div id="logo-container">
          <q-img :src="logo" spinner-color="white" fir="cover" />
        </div>
        <q-btn
          push
          color="dark"
          label="login"
          size="xl"
          padding="sm xl"
          @click="login"
          class="q-mt-lg"
        />
        <h1 class="text-weight-medium text-purple-6" id="app-name">
          Loan360 Cloud
        </h1>
      </div>
    </div>
    <CompanyAndBranchSelectorModal
      v-if="isCompanyAndBranchSelectorModalActive"
    />
  </div>
</template>

<script setup>
import logo from 'src/assets/img/JaguarCloud.png';
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

const getDataOnRefresh = () => {
  // Header Set and Authentication
  const authToken = localStorage.getItem('authToken') || '';
  const expires_in = localStorage.getItem('expires_in') || 0;
  const companyData = localStorage.getItem('selectedCompany');
  const branchData = localStorage.getItem('selectedBranch');
  const financialYearData = localStorage.getItem('selectedFinancialYear');
  const company = companyData
    ? JSON.parse(companyData)
    : { code: '', name: '' };
  const branch = branchData
    ? JSON.parse(branchData)
    : {
        code: '',
        name: ' ',
        inactive: false,
        inactiveOn: null,
        headOffice: null,
      };
  const financialYear = financialYearData
    ? JSON.parse(financialYearData)
    : selectedFinancialYear.value;

  if (userStore.token && userStore.token.id_token) {
    userStore.setAuthHeader(userStore.token.id_token);
  } else if (authToken) {
    userStore.setAuthHeader(authToken);
    userStore.setToken({
      id_token: authToken,
      expires_in: Number(expires_in),
    });
    userStore.saveCompanyDetails(company, branch, financialYear);
  } else {
    userStore.setAuthHeader('');
    router.push({ name: 'login' });
  }
};

onMounted(async () => {
  if (route.query.code) {
    const rsp = await getAuthTokenFromAws(route.query.code);
    if (rsp.access_token) {
      userStore.setToken({
        id_token: rsp.id_token,
        expires_in: rsp.expires_in,
      });
      userStore.setAccessToken(rsp.access_token);
      localStorage.setItem('authToken', rsp.id_token);
      localStorage.setItem('expires_in', rsp.expires_in);
      router.push({ name: 'authenticated' });
    } else {
      router.push({ name: 'noFound' });
    }
  }
  if (userStore.isAuthenticated) {
    router.push({ name: 'authenticated' });
  }
  getDataOnRefresh();
});
</script>

<style lang="scss" scoped>
#main {
  overflow: hidden;
}
#logo-container {
  width: clamp(100px, 50vw, 300px);
}

#app-name {
  font-size: calc(7vw + 1rem) !important;
}
</style>
