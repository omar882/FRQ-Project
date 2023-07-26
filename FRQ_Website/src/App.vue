<script setup>
import { dataModel, globals } from "./dataModel.js";
import { onBeforeMount, onMounted, ref, toRaw } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const loaded = ref(false);
onMounted(() => {
  console.log(localStorage.getItem("userToken"));
  console.log("mounting...");
  var userToken = localStorage.getItem("userToken");
  var type = localStorage.getItem("type");
  let baseURI;
  if (type === "teacher") {
    baseURI = globals.serverUrl + "getTeacherExpirationtime";
  } else {
    baseURI = globals.serverUrl + "getStudentExpirationtime";
  }
  if (dataModel.currentUser != null) {
    console.log("already loaded");
    loaded.value = true;

    return;
  } else if (userToken) {
    axios.post(baseURI, { userToken: userToken }).then((result) => {
      //alert(JSON.stringify(result.data));
      console.log(result.data);

      if (result.data.logIn) {
        dataModel.currentUser = result.data.user;
        console.log("updated dataModel");
        dataModel.currentUser.userToken = result.data.userToken;
        loaded.value = true;
      }
      console.log("failed to updated");
      console.log("done");

      loaded.value = true;
    });
  }
  loaded.value = true;
});
</script>

<template>
  <router-view v-if="loaded"> </router-view>
</template>
