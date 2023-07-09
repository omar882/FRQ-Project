<script setup>
import Login from "../../components/teacherComponents/Login.vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="flex justify-content-center">
    <Image
      src="logo.png"
      class="card flex align-items-center justify-content-center"
      alt="Image"
      width="250"
      style="cursor: pointer"
      @click="router.push('/')"
    />
  </div>
  <Login />
</template>
