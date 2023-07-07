<script setup>
import axios from "axios";
import { computed, onBeforeMount, ref } from "vue";
import { globals, dataModel } from "../dataModel.js";
import { useRouter } from "vue-router";
import TopHeader from "@/components/TopHeader.vue";
import StudentReviews from "@/components/StudentReviews.vue";

const completedTable = ref(0);
const router = useRouter();
const menu = ref();
const items = ref([
  {
    label: "wow",
    items: [
      {
        label: "Log out",
        command: () => {
          dataModel.currentUser = null;
          router.push("/login");
        },
      },
      {
        label: "My profile",
      },
    ],
  },
]);
onBeforeMount(() => {
  if (dataModel.currentUser == null) router.push({ path: "/login" });
});
const toggleUserPopup = (event) => {
  console.log(event);
  menu.value.toggle(event);
};
</script>

<template>
  <div class="card" style="width: 100%">
    <div style="width: 100%">
      <div style="width: 100%">
        <TopHeader :user="dataModel" @togglePopupVisibility="toggleUserPopup" />

        <Menu
          ref="menu"
          :popup="true"
          :model="items"
          :pt="{
            submenuHeader: { class: 'hidden' },
          }"
        ></Menu>
      </div>
      <div>
        <Divider />
      </div>
      <div class="card">
        <div class="card-container blue-container overflow-hidden">
          <div
            class="flex md:flex-row flex-column align-items-center justify-content-center w-full"
          >
            <div
              class="flex flex-row align-items-center justify-content-center font-bold text-white w-full m-1 border-round"
            >
              <StudentReviews
                :key="completedTable"
                review-type="Completed"
                class=""
              />
            </div>
          </div>
        </div>
      </div>

      <!-- <div>Current user {{ this.getUserInfo() }}</div> -->
    </div>
  </div>
</template>
<style scoped></style>
