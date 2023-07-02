<script setup>
import { globals, dataModel } from "../dataModel.js";
import axios from "axios";
import { ref, defineProps, onMounted, watch, defineExpose } from "vue";
import { useMouse } from "@vueuse/core";
import QuestionDetails from "@/components/QuestionDetails.vue";
const { x, y, sourceType } = useMouse();
const props = defineProps(["reviewType"]);
let reviewType = props.reviewType;
const questions = ref(null);
const columns = ref(null);
const selectedRows = ref();
const showData = ref(false);

let questionData;
const datatable = ref(null);
const viewData = (selectedRows) => {
  //console.log(datatable);
  if (selectedRows != null) {
    showData.value = true;

    //console.log(selectedRows);
    questionData = {
      info: selectedRows,
      showData: showData,
    };
  }

  //datatable.value.selection = {};

  //console.log(datatable.value.selection);
};

const addNewReview = () => {};
const updateCompletedReviews = () => {
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
        //console.log(questions.value);
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
  <QuestionDetails v-if="showData" :data="questionData"></QuestionDetails>

  <div class="card" ref="dataTable">
    <table class="table">
      <tr>
        <th>Date</th>
        <th>Subject</th>
        <th>Question</th>
      </tr>
      <tr v-for="question in questions" @click="viewData(question)">
        <td>{{ formatDate(question.submissionDate) }}</td>
        <td>{{ question.subjectName }}</td>
        <td>
          {{ question.customQuestionText }}
        </td>
      </tr>
    </table>
    <!-- <DataTable
        v-model:selection="selectedRows"
        selectionMode="single"
        ref="datatable"
        v-if="reviewType == 'InReview'"
        :value="questions"
        tableStyle="min-width: 100%"
        @click="viewData(selectedRows)"
      >
        <Column field="date" header="Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.submissionDate) }}
          </template>
        </Column>
        <Column field="subjectName" header="Subject"></Column>
        <Column field="customQuestionText" header="Question"></Column>
      </DataTable>

      <DataTable
        v-else="reviewType == 'Completed'"
        :value="questions"
        tableStyle="min-width: 100%"
      >
        <Column field="date" header="Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.submissionDate) }}
          </template>
        </Column>
        <Column field="subjectName" header="Subject"></Column>
        <Column field="customQuestionText" header="Question"></Column>
      </DataTable> -->
  </div>
</template>

<style setup>
.table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

td,
th {
  border: 1px solid #ddd;
  padding: 8px;
}
td {
  cursor: pointer;
}
th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04aa6d;
  color: white;
}
table::-webkit-scrollbar {
  background-color: red;
}
table::-webkit-scrollbar-thumb {
  background-color: red;
}
table::-webkit-scrollbar-thumb:window-inactive {
  background-color: red;
}
</style>
