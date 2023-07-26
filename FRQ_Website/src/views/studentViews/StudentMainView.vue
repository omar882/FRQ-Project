<script setup>
import { ref, onBeforeMount } from "vue";
import OpenReviews from "../../components/studentComponents/OpenReviews.vue";
import CompletedReviews from "../../components/studentComponents/CompletedReviews.vue";
import TopHeader from "../../components/studentComponents/TopHeader.vue";
import { dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";
const active = ref(-1);
const router = useRouter();
const loaded = ref(-1);
const menu = ref();
const items = ref([
  {
    label: "wow",
    items: [
      {
        label: "Log out",
        command: () => {
          console.log("test");
          dataModel.currentUser = null;
          localStorage.setItem("userToken", "");
          localStorage.setItem("type", "");

          router.push("/studentlogin");
        },
      },
      {
        label: "My profile",
      },
    ],
  },
]);
const toggleUserPopup = (event) => {
  menu.value.toggle(event);
};
const change = (value) => {
  active.value = value;
};

onBeforeMount(() => {
  let tmpRouter = useRouter();

  console.log(dataModel);
  if (dataModel.currentUser != null) {
    loaded.value = 1;

    active.value = 0;
  } else {
    console.log("in");
    const redirect = () => {
      window.location.href =
        "http://127.0.0.1:5500/FRQ_Website/bootstrap_website/home.html";
    };
  }
});
</script>
<template>
  <div v-if="loaded != -1">
    <div>
      <Menu
        ref="menu"
        :popup="true"
        :model="items"
        :pt="{
          submenuHeader: { class: 'hidden' },
        }"
      ></Menu>
      <TopHeader
        @change="change"
        @togglePopupVisibility="toggleUserPopup"
        :user="dataModel"
      ></TopHeader>

      <div class="flex w-full justify-content-center">
        <div class="flex w-11 justify-content-center">
          <CompletedReviews v-if="active == 0"></CompletedReviews>
          <OpenReviews v-if="active == 1"></OpenReviews>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
