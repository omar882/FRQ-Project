<script setup>
import { ref } from "vue";
import { defineProps } from "vue";
const props = defineProps(["reviewType"]);
const reviewType = props.reviewType;
let menu = ref();
const items = ref([
  {
    label: "File",
    icon: "pi pi-fw pi-file",
    to: "/",
  },
  {
    label: "Edit",
    icon: "pi pi-fw pi-pencil",
  },
  {
    label: "Users",
    icon: "pi pi-fw pi-user",
  },
  {
    label: "Events",
    icon: "pi pi-fw pi-calendar",
  },
  {
    label: "Quit",
    icon: "pi pi-fw pi-power-off",
  },
]);
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
  <div class="card relative z-2">
    <Menu
      ref="menu"
      :popup="true"
      :model="loginOptions"
      :pt="{
        submenuHeader: { class: 'hidden' },
      }"
    ></Menu>
    <div
      class="flex flex-row justify-content-between align-items-center ml-2 mr-2 mt-1"
    >
      <div>
        <img src="logo.png" class="h-4rem" alt="" />
      </div>
      <tabMenu
        :model="items"
        class="flex justify-content-center align-items-center"
        :pt="{
          action: ({ props, state, context }) => ({
            class:
              context.order === state.d_activeIndex ? 'bg-primary' : undefined,
          }),
        }"
      >
      </tabMenu>
      <div>
        <Avatar
          icon="pi pi-user"
          class="mr-2"
          size="large"
          shape="circle"
          style="cursor: pointer"
          @click="toggleMenu"
        />
      </div>
    </div>
  </div>
</template>
