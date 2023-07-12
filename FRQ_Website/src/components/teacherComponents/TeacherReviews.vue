<script setup>
import axios from "axios";
import { globals, dataModel } from "../../dataModel.js";
import { ref, defineProps, onMounted, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import TeacherReviewsTable from "./TeacherReviewsTable.vue";

const emit = defineEmits(["updateTable"]);
const props = defineProps(["reviewType"]);
const router = useRouter();
const toast = useToast();
let reviewType = props.reviewType;
const questionList = ref(null);

const getTitle = () => {
  //console.log(reviewType);
  if (reviewType == "Completed") {
    return "My Completed Reviews";
  } else if (reviewType == "Active") {
    return "My Active Reviews";
  }
  return "Open Reviews";
};

onMounted(() => {});
</script>

<template>
  <div class="container">
    <Fieldset class="container">
      <template #legend>
        <div>
          <span class="pi pi-verified mr-2"></span>
          <span class="font-bold text-lg">{{ getTitle() }}</span>
        </div>
      </template>
      <p class="m-0">
        <ScrollPanel style="width: 100%; height: 400px">
          <TeacherReviewsTable
            @updateTable="emit('updateTable')"
            :review-type="reviewType"
            ref="questionList"
            :key="studentTable"
          />
        </ScrollPanel>
      </p>

      <div
        v-if="reviewType === 'InReview'"
        class="flex justify-content-end text-primary m-1"
      ></div>
    </Fieldset>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 35rem;
}
</style>
