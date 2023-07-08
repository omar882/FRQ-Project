<script setup>
import { ref, defineProps, onMounted, defineEmits } from "vue";
import { globals, dataModel } from "../dataModel.js";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps(["user"]);
const emit = defineEmits(["togglePopupVisibility"]);

const loggedIn = ref(false);
const visible = ref(false);
const userPopupVisibility = ref(false);

let firstLetter;
onMounted(() => {
  firstLetter = props.user.currentUser.email.charAt(0).toUpperCase();
  if (props.user != null) {
    loggedIn.value = true;
  }
});
const toggleUserPopup = (event) => {
  emit("togglePopupVisibility", event);
};
const items = ref([
  {
    label: "My Completed Reviews",
    icon: "pi pi-fw pi-file",
    to: "/completedreviews",
  },
  {
    label: "My Open Reviews",
    icon: "pi pi-fw pi-pencil",
    to: "openreviews",
  },
]);
</script>

<template>
  <div class="card" style="width: 100%">
    <div
      class="flex justify-content-between flex-wrap card-container purple-container align-items-center"
    >
      <div
        class="flex justify-content-center w-4rem h-4rem bg-purple-500 font-bold text-white border-round m-2"
      >
        <Image
          src="logo.png"
          class="card flex align-items-center justify-content-center"
          alt="Image"
          width="80"
        />
      </div>
      <div class="align-items-center">
        <Menubar :model="items"> </Menubar>
      </div>
      <div
        class="flex align-items-center justify-content-center w-4rem h-4rem font-bold text-white border-round m-2"
      >
        <Avatar
          v-if="loggedIn"
          :label="firstLetter"
          class="mr-2 userSelect"
          size="large"
          style="background-color: #2196f3; color: #ffffff; cursor: pointer"
          shape="circle"
          @click="toggleUserPopup"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.userSelect {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
