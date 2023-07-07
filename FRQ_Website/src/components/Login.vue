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
  //console.log("in");
  const baseURI = globals.serverUrl + "login";
  axios
    .post(baseURI, { userName: username.value, password: password.value })
    .then((result) => {
      //alert(JSON.stringify(result.data));
      //console.log(result);
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
    <div class="card w-full">
      <div
        class="flex flex-column justify-content-center align-items-center w-full"
      >
        <div
          class="flex flex-column align-items-center justify-content-center gap-3 py-5 w-full"
        >
          <div class="flex align-items-center justify-content-center gap-2 w-5">
            <label class="flex w-1 justify-content-end">Username</label>
            <InputText
              id="username"
              type="text"
              class="flex w-full w-9 ml-2"
              v-model="username"
            />
          </div>
          <div class="flex flex-column align-items-center gap-2 w-5">
            <div
              class="flex flex-row justify-content-center gap-2 align-items-center w-12"
            >
              <label class="flex w-1 justify-content-end">Password</label>
              <InputText
                id="password"
                type="password"
                class="w-full w-9 ml-2"
                v-model="password"
              />
            </div>
            <Button
              @click="login"
              label="Login"
              icon="pi pi-user"
              class="w-10rem mt-5"
            ></Button>
          </div>
        </div>
        <div class="flex w-full md:w-1 justify-content-center">
          <Divider layout="horizontal" class="flex" align="center"
            ><b>OR</b></Divider
          >
        </div>
        <div
          class="w-full md:w-6 flex align-items-center justify-content-center py-5"
        >
          <Button
            label="Sign Up"
            icon="pi pi-user-plus"
            severity="success"
            class="w-10rem"
            @click="router.push('/signup')"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>
