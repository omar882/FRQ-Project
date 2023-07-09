<script setup>
let type = "none";
import menuBar from "../components/menuBar.vue";
</script>
<template>
  <menuBar></menuBar>
  <div
    class="flex flex-row h-screen w-screen bg-section justify-content-center"
  >
    <div class="flex card w-full">
      <div class="w-8"></div>
      <div class="w-4">
        <img src="gradeboost.png" class="w-full" alt="" />
      </div>
    </div>
  </div>
</template>
<style scoped>
body {
  margin: 0;
  padding: 0;
}
</style>
