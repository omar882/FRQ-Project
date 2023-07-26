<script setup>
import Login from "../../components/studentComponents/Login.vue";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { dataModel } from "../../dataModel";

const router = useRouter();
const redirect = () => {
  window.location.href =
    "http://127.0.0.1:5500/FRQ_Website/bootstrap_website/home.html";
};
</script>

<template>
  <div class="flex justify-content-center">
    <Image
      src="logo.png"
      class="card flex align-items-center justify-content-center"
      alt="Image"
      width="250"
      style="cursor: pointer"
      @click="redirect"
    />
  </div>
  <Login />
</template>
