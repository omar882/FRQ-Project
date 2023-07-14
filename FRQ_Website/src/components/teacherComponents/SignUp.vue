<script setup>
import axios from "axios";
import { globals, dataModel } from "../../dataModel.js";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const name = "Vue.js";

const selectedSubjects = ref();
const subjects = ref([]);
const username = ref("");
const lastname = ref("");

const password = ref("");
const school = ref("");
const resume = ref("");
const linkedIn = ref("");

const yearsOfExperience = ref();
const email = ref("");
const dateofbirth = ref(null);
watch(selectedSubjects, () => {
  console.log(selectedSubjects.value);
});
const loadSubjects = () => {
  const baseURI = globals.serverUrl + "subjects";
  axios.post(baseURI, {}).then((result) => {
    //alert(JSON.stringify(result.data));
    if (result.data != null) {
      console.log(result.data);
      subjects.value = result.data;
    }
  });
};
onBeforeMount(() => {
  loadSubjects();
});
const signup = (event) => {
  const formattedDate = dateofbirth.value.toISOString().split("T")[0];

  let baseURI = globals.serverUrl + "teachersignup";
  axios
    .post(baseURI, {
      userName: username.value,
      password: password.value,
      dateofbirth: formattedDate,
      yearsOfExperience: yearsOfExperience.value,
      email: email.value,
      lastname: lastname.value,
      linkedIn: linkedIn.value,
      onlineResume: resume.value,
    })
    .then((result) => {
      selectedSubjects.value.forEach((subject) => {
        baseURI = globals.serverUrl + "addteachersubject";
        console.log(subject);
        console.log(subject.id);
        axios.post(baseURI, {
          subjectId: subject.id,
          email: email.value,
          password: password.value,
        });
      });
      router.push("/teacherlogin");
    });
};
</script>

<template>
  <div class="justify-content-center flex align-items-center mt-3 h-1rem">
    <h1 class="align-text-center text-blue-500">Apply to become a teacher!</h1>
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
              <label>Years of experience</label>
              <InputText
                id="years of experience"
                type="number"
                class="w-full"
                v-model="yearsOfExperience"
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
            <div class="w-5">
              <label>LinkedIn Profile</label>

              <InputText
                id="school"
                type="text"
                class="w-full"
                v-model="linkedIn"
              />
            </div>
          </div>
          <div
            class="flex flex-row align-items-center justify-content-center w-6 gap-6"
          >
            <div class="w-5">
              <label>Resume</label>

              <InputText
                showIcon
                class="w-full"
                v-model="resume"
                dateFormat="yy/mm/dd"
              />
            </div>
            <div class="w-5">
              <label>Subjects </label>

              <MultiSelect
                v-model="selectedSubjects"
                :options="subjects"
                optionLabel="name"
                placeholder="Select Subjects"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <div
          class="w-full flex align-items-center justify-content-center py-4 flex h-3rem"
        >
          <Button
            @click="signup"
            label="Sign Up"
            icon="pi pi-user"
            class="w-10rem mr-5"
          ></Button>
          <a @click="router.push('/teacherlogin')" class="anchor">
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
