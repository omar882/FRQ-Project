<script setup>
import axios from "axios";
import { globals, dataModel } from "../dataModel.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const name = "Vue.js";
const username = ref("");
const password = ref("");

const login = (event) => {
  //alert(this.username + " - " + this.password);
  console.log("in");
  const baseURI = globals.serverUrl + "login";
  axios
    .post(baseURI, { userName: username.value, password: password.value })
    .then((result) => {
      //alert(JSON.stringify(result.data));
      console.log(result);
      if (result.data != "") {
        dataModel.currentUser = result.data;

        //this.loadData();
        router.push("/home");
      }
    });
};
const loadData = () => {
  const baseURI = globals.serverUrl + "subjects";
  axios.post(baseURI, { token: dataModel.currentUser.token }).then((result) => {
    //alert(JSON.stringify(result.data));

    if (result.data != "") {
      dataModel.subjects = result.data;
      alert(dataModel.subjects);
    }
  });
};
</script>

<template>
  <div class="card flex align-items-center justify-content-center">
    <div class="card">
      <div class="flex flex-column md:flex-row">
        <div
          class="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5"
        >
          <div class="flex align-items-center gap-2">
            <label>Username</label>
            <InputText
              id="username"
              type="text"
              class="w-full"
              v-model="username"
            />
          </div>
          <div class="flex align-items-center gap-2">
            <label>Password</label>
            <InputText
              id="password"
              type="password"
              class="w-full"
              v-model="password"
            />
          </div>
          <Button
            @click="login"
            label="Login"
            icon="pi pi-user"
            class="w-10rem"
          ></Button>
        </div>
        <div class="w-full md:w-2">
          <Divider layout="vertical" class="hidden md:flex"><b>OR</b></Divider>
          <Divider layout="horizontal" class="flex md:hidden" align="center"
            ><b>OR</b></Divider
          >
        </div>
        <div
          class="w-full md:w-5 flex align-items-center justify-content-center py-5"
        >
          <Button
            label="Sign Up"
            icon="pi pi-user-plus"
            severity="success"
            class="w-10rem"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>
