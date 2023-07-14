<script setup>
import SignUp from "../../components/teacherComponents/SignUp.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <Image
    src="logo.png"
    class="card flex align-items-center justify-content-center"
    alt="Image"
    width="250"
    @click="router.push('/')"
  />
  <SignUp></SignUp>
</template>
