<script setup>
import { globals, dataModel } from "../dataModel.js";
import axios from "axios";
import { ref, defineProps, onMounted, watch, defineExpose } from "vue";
const props = defineProps(["reviewType"]);
let reviewType = props.reviewType;
const questions = ref(null);
const columns = ref(null);

const addNewReview = () => {};
const updateCompletedReviews = () => {
  alert("it is public");
  var baseURI = null;
  if (reviewType == "Completed")
    baseURI = globals.serverUrl + "completedreviews";
  else if (reviewType == "InReview")
    baseURI = globals.serverUrl + "openreviews";
  else {
    alert(reviewType);
    return;
  }

  axios
    .post(baseURI, { userToken: dataModel.currentUser.userToken })
    .then((result) => {
      //alert(JSON.stringify(result.data));

      if (result.data != null) {
        //this.subjects = result.data;
        questions.value = JSON.parse(JSON.stringify(result.data));
        console.log(questions.value);
      }
    });
};
defineExpose({ updateCompletedReviews });

const formatDate = (dateField) => {
  var date = new Date(dateField);
  return date.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  columns.value = [
    { field: "submissionDate", header: "Date" },
    { field: "subjectId", header: "Subject" },
    { field: "customQuestionText", header: "Question" },
  ];
  updateCompletedReviews();
  //this.questions = [{ code: '123', name: '123', category: '123', quantity: '123' }, { code: '123', name: '123', category: '123', quantity: '123' }];
  //alert(JSON.stringify(this.products));
});
</script>

<template>
  <div class="card">
    <DataTable
      v-if="reviewType == 'InReview'"
      :value="questions"
      tableStyle="min-width: 50rem"
    >
      <Column field="date" header="Date" style="min-width: 200px" sortable>
        <template #body="{ data }">
          {{ formatDate(data.submissionDate) }}
        </template>
      </Column>
      <Column
        field="subjectName"
        header="Subject"
        style="min-width: 200px"
      ></Column>
      <Column
        field="customQuestionText"
        header="Question"
        style="min-width: 200px"
      ></Column>
    </DataTable>

    <DataTable
      v-else="reviewType == 'Completed'"
      :value="questions"
      tableStyle="min-width: 50rem"
    >
      <Column field="date" header="Date" style="min-width: 200px" sortable>
        <template #body="{ data }">
          {{ formatDate(data.submissionDate) }}
        </template>
      </Column>
      <Column
        field="subjectName"
        header="Subject"
        style="min-width: 200px"
      ></Column>
      <Column
        field="customQuestionText"
        header="Question"
        style="min-width: 200px"
      ></Column>
    </DataTable>
  </div>
</template>
