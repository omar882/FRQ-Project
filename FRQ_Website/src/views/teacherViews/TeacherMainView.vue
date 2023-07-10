<script setup>
import { ref, onBeforeMount } from "vue";
import TopHeader from "../../components/teacherComponents/TopHeader.vue";
import OpenReviews from "../../components/teacherComponents/OpenReviews.vue";
import CompletedReviews from "../../components/teacherComponents/CompletedReviews.vue";
import { dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";

const router = useRouter();
const active = ref(0);
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
onBeforeMount(() => {
  if (localStorage.getItem("type") != "teacher") {
    router.push("/home");
  }
});
</script>
<template>
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
    <OpenReviews v-if="active === 0"></OpenReviews>
    <OpenReviews v-if="active === 1"></OpenReviews>
    <OpenReviews v-if="active === 2"></OpenReviews>
  </div>
</template>
