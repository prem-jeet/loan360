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
import { login } from 'src/utils/auth/login';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isCompanyAndBranchSelectorModalActive = computed(
  () => !!route.query.code
);

onMounted(async () => {
  if (route.query.code) {
    /* TODO: call get getAuthTokenFromAws */
    /*  retrieve the auth token */
  }
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
