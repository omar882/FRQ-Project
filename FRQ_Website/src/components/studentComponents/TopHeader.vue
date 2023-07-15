<script setup>
import { ref, defineProps, onMounted, defineEmits, watch } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps(["user"]);
const emit = defineEmits(["togglePopupVisibility", "change"]);

const loggedIn = ref(false);
const visible = ref(false);
const userPopupVisibility = ref(false);
const activeIndex = ref(0);

let firstLetter;
onMounted(() => {
  firstLetter = dataModel.currentUser.email.charAt(0).toUpperCase();
  if (dataModel != null) {
    loggedIn.value = true;
  }
});
const toggleUserPopup = (event) => {
  emit("togglePopupVisibility", event);
};
const items = ref([
  {
    label: "My Completed Reviews",
  },
  {
    label: "My Open Reviews",
  },
]);
const test = () => {
  emit("change", activeIndex.value);
};
</script>

<template>
  <div class="card w-full flex-column" style="width: 100%">
    <div
      class="flex justify-content-between flex-wrap card-container purple-container align-items-center"
    >
      <div
        class="flex justify-content-center w-4rem h-4rem font-bold text-white border-round m-2"
      >
        <Image
          src="logo.png"
          class="card flex align-items-center justify-content-center ml-5"
          alt="Image"
          width="80"
        />
      </div>

      <div
        class="flex align-items-center justify-content-center w-4rem h-4rem font-bold text-white border-round m-2"
      >
        <Avatar
          v-if="loggedIn"
          :label="firstLetter"
          class="mr-3 userSelect"
          size="large"
          style="background-color: #2196f3; color: #ffffff; cursor: pointer"
          shape="circle"
          @click="toggleUserPopup"
        />
      </div>
    </div>
    <div class="flex align-items-center justify-content-center">
      <TabMenu
        @click="test"
        v-model:activeIndex="activeIndex"
        :model="items"
        :pt="{
          action: ({ props, state, context }) => ({
            class:
              context.order === state.d_activeIndex ? 'bg-primary' : undefined,
          }),
        }"
      />
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
