<script setup>
import axios from "axios";
import { globals, dataModel } from "../../dataModel.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const name = "Vue.js";
const username = ref("");
const lastname = ref("");

const password = ref("");
const school = ref("");

const grade = ref("");
const email = ref("");
const dateofbirth = ref(null);

const signup = (event) => {
  const formattedDate = dateofbirth.value.toISOString().split("T")[0];
  const baseURI = globals.serverUrl + "signup";
  console.log(dateofbirth.value);
  axios
    .post(baseURI, {
      userName: username.value,
      password: password.value,
      dateofbirth: formattedDate,
      grade: grade.value,
      email: email.value,
      lastname: lastname.value,
    })
    .then((result) => {
      router.push("/studentlogin");
    });
};
</script>

<template>
  <div class="justify-content-center flex align-items-center mt-3 h-1rem">
    <h1 class="align-text-center text-blue-500">Student Sign Up</h1>
  </div>

  <div class="card flex align-items-center justify-content-center">
    <div class="card w-full">
      <div class="flex flex-column">
        <div
          class="w-full flex flex-column align-items-center justify-content-center gap-1 py-5"
        >
          <div
            class="flex flex-row align-items-center justify-content-center w-6 gap-6"
          >
            <div class="w-5">
              <label>First Name</label>
              <InputText
                id="username"
                type="text"
                class="w-full"
                v-model="username"
              />
            </div>
            <div class="w-5">
              <label>Last Name</label>
              <InputText
                id="lastname"
                type="lastname"
                class="w-full"
                v-model="lastname"
              />
            </div>
          </div>
          <div
            class="flex flex-row align-items-center justify-content-center w-6 gap-6"
          >
            <div class="w-5">
              <label>Email</label>
              <InputText
                id="email"
                type="text"
                class="w-full"
                v-model="email"
              />
            </div>
            <div class="w-5">
              <label>Password</label>
              <InputText
                id="password"
                type="password"
                class="w-full"
                v-model="password"
              />
            </div>
          </div>
          <div
            class="flex flex-row align-items-center justify-content-center w-6 gap-6"
          >
            <div class="w-5">
              <label>Grade</label>
              <InputText
                id="grade"
                type="number"
                class="w-full"
                v-model="grade"
              />
            </div>
            <div class="w-5">
              <label>School</label>
              <InputText
                id="school"
                type="text"
                class="w-full"
                v-model="school"
              />
            </div>
          </div>
          <div
            class="flex flex-row align-items-center justify-content-center w-6 gap-6"
          >
            <div class="w-5">
              <label>Date Of Birth</label>

              <Calendar
                showIcon
                class="w-full"
                v-model="dateofbirth"
                dateFormat="yy/mm/dd"
              />
            </div>
          </div>
        </div>

        <div
          class="w-full flex align-items-center justify-content-center py-5 flex h-3rem"
        >
          <Button
            @click="signup"
            label="Sign Up"
            icon="pi pi-user"
            class="w-10rem mr-5"
          ></Button>
          <a @click="router.push('/studentlogin')" class="anchor">
            Or go to login...
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.anchor {
  cursor: pointer;
  color: rgb(146, 146, 146);
  font-weight: bold;
}
</style>
