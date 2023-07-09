<script setup>
import { dataModel, globals } from "./dataModel.js";
import { onBeforeMount, onMounted, ref, toRaw } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const loaded = ref(false);
onMounted(() => {
  console.log("mounting...");

  const baseURI = globals.serverUrl + "getExpirationtime";
  var userToken = localStorage.getItem("userToken");
  if (dataModel.currentUser != null) {
    loaded.value = true;

    return;
  } else if (userToken) {
    axios.post(baseURI, { userToken: userToken }).then((result) => {
      //alert(JSON.stringify(result.data));
      //console.log(result.data);

      if (result.data.logIn) {
        dataModel.currentUser = result.data.user;
        dataModel.currentUser.userToken = result.data.userToken;
        loaded.value = true;
      } else {
        router.push("/studentlogin");
        loaded.value = true;
      }
    });
  } else {
    router.push("/studentlogin");
    loaded.value = true;
  }
});
</script>

<template>
  <router-view v-if="loaded"> </router-view>
</template>
