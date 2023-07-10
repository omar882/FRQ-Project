<script setup>
import { ref, onBeforeMount } from "vue";
import OpenReviews from "../../components/studentComponents/OpenReviews.vue";
import CompletedReviews from "../../components/studentComponents/CompletedReviews.vue";
import TopHeader from "../../components/studentComponents/TopHeader.vue";
import { dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";
const router = useRouter();
const active = ref(1);

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
  if (localStorage.getItem("type") === "teacher") {
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
    <CompletedReviews v-if="active"></CompletedReviews>
    <OpenReviews v-if="1 - active"></OpenReviews>
  </div>
</template>
<style scoped></style>
