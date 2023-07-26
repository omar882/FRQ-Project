<script setup>
import { ref, onBeforeMount } from "vue";
import TopHeader from "../../components/teacherComponents/TopHeader.vue";
import OpenReviews from "../../components/teacherComponents/OpenReviews.vue";
import ActiveReviews from "../../components/teacherComponents/ActiveReviews.vue";
import CompletedReviews from "../../components/teacherComponents/CompletedReviews.vue";

import { dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";
const loaded = ref(-1);
const router = useRouter();
const active = ref(-1);
const redirect = () => {
  window.location.href =
    "http://127.0.0.1:5500/FRQ_Website/bootstrap_website/home.html";
};

onBeforeMount(() => {
  console.log(dataModel);
  if (dataModel.currentUser != null) {
    loaded.value = 1;
    active.value = 0;
  } else {
    console.log("in");

    redirect();
  }
});

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

          router.push("/teacherlogin");
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
const change = (e) => {
  active.value = e;
};
</script>
<template>
  <div v-if="loaded != -1">
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
        <OpenReviews v-if="active === 0"></OpenReviews>
        <ActiveReviews v-if="active === 1"></ActiveReviews>
        <CompletedReviews v-if="active === 2"></CompletedReviews>
        <OpenReviews v-if="active === 3"></OpenReviews>
      </div>
    </div>
  </div>
</template>
