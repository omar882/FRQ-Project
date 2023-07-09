<script setup>
import { ref } from "vue";
let menu = ref();

const loginOptions = ref([
  {
    label: "Student Login",
    to: "/studentlogin",
  },
  {
    label: "Teacher Login",
    to: "/teacherlogin",
  },
]);

const toggleMenu = (event) => {
  menu.value.toggle(event);
};
</script>
<template>
  <div
    class="flex flex-row w-full justify-content-between align-items-center p-3"
  >
    <img src="logo.png" class="w-4rem" alt="" />

    <Avatar
      icon="pi pi-user"
      class="mr-2"
      size="xlarge"
      shape="circle"
      style="cursor: pointer"
      @click="toggleMenu"
    />
  </div>
  <Menu
    ref="menu"
    :popup="true"
    :model="loginOptions"
    :pt="{
      submenuHeader: { class: 'hidden' },
    }"
  ></Menu>
  <h1>Home View</h1>
</template>
<style scoped>
body {
  margin: 0;
  padding: 0;
}
</style>
