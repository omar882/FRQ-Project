<script setup>
import axios from "axios";
import { computed, onBeforeMount, ref } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";
import TeacherReviews from "./TeacherReviews.vue";
const completedTable = ref(0);
const router = useRouter();
</script>

<template>
  <div class="card" style="width: 100%">
    <div style="width: 100%">
      <div style="width: 100%"></div>

      <div class="card">
        <div class="card-container blue-container overflow-hidden">
          <div
            class="flex md:flex-row flex-column align-items-center justify-content-center w-full"
          >
            <div
              class="flex flex-row align-items-center justify-content-center font-bold text-white w-full m-1 border-round"
            >
              <TeacherReviews
                :key="completedTable"
                review-type="Active"
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
