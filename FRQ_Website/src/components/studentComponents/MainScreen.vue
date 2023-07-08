<script setup>
import axios from "axios";
import { globals } from "../../dataModel.js";
import { ref } from "vue";

const name = "Vue.js";

const login = (event) => {
  const baseURI = globals.serverUrl + "login";
  axios
    .post(baseURI, { userName: "Ahmed", password: "password" })
    .then((result) => {
      //alert(result.data);
    });
};
const gotoLogin = () => {
  $router.push({ path: "/login" });
};
</script>

<template>
  <h1>Main Screen</h1>
</template>
