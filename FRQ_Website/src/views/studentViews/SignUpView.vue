<script setup>
import SignUp from "../../components/studentComponents/SignUp.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const redirect = () => {
  window.location.href =
    "http://127.0.0.1:5500/FRQ_Website/bootstrap_website/home.html";
};
</script>

<template>
  <Image
    src="logo.png"
    class="card flex align-items-center justify-content-center"
    alt="Image"
    width="250"
    style="cursor: pointer"
    @click="redirect"
  />

  <SignUp></SignUp>
</template>
