<script>
import axios from "axios";
import { globals, dataModel } from "../dataModel.js";

//import Button from 'primevue/Button'
import TopHeader from "@/components/TopHeader.vue";
import StudentReviews from "@/components/StudentReviews.vue";

export default {
  data() {
    return {
      globals,
      dataModel,
    };
  },
  components: {
    TopHeader,
    StudentReviews,
  },
  computed: {
    isLoggedIn() {
      // `this` points to the component instance
      return dataModel.currentUser == null ? false : true;
    },
    currentView() {
      if (this.isLoggedIn()) {
        this.$router.push({ path: "/home" });
      } else this.$router.push({ path: "/login" });
    },
    test() {
      alert("Test");
    },
  },
  methods: {
    goToDashboard() {
      if (isLoggedIn()) {
        this.$router.push("/dashboard");
      } else {
        this.$router.push("/login");
      }
    },
    gotoLogin() {
      this.$router.push({ path: "/login" });
    },
    getUserInfo() {
      return JSON.stringify(this.dataModel.currentUser);
    },
  },
  beforeCreate: function () {
    //alert('lll ' + (dataModel.currentUser == null));
    if (dataModel.currentUser == null) this.$router.push({ path: "/login" });
    //else
    //    this.loadData();

    //this.computed.test();
    //this.computed.currentView() // Calls the method before page loads
  },
  mounted: function () {
    //alert("Home view mounted");
    //this.loadData();
  },
};
</script>

<template>
  <div class="card" style="width: 100%">
    <div style="width: 100%">
      <div style="width: 100%">
        <TopHeader />
      </div>
      <div>
        <Divider />
      </div>

      <div class="card">
        <div class="card-container blue-container overflow-hidden">
          <div
            class="flex md:flex-row flex-column align-items-center justify-content-center"
          >
            <div
              class="flex flex-row align-items-center justify-content-center font-bold text-white md:w-6 w-12 m-1 border-round"
            >
              <StudentReviews review-type="Completed" class="" />
            </div>
            <div
              class="flex flex-row align-items-center justify-content-center font-bold text-white md:w-6 w-12 m-1 border-round"
            >
              <StudentReviews review-type="InReview" />
            </div>
          </div>
        </div>
      </div>

      <!-- <div>Current user {{ this.getUserInfo() }}</div> -->
    </div>
  </div>
</template>
