<script setup>
import { globals, dataModel } from "../../dataModel.js";
import axios from "axios";
import {
  ref,
  defineProps,
  onMounted,
  watch,
  defineExpose,
  defineEmits,
} from "vue";
import { useMouse } from "@vueuse/core";
import QuestionDetails from "./QuestionDetails.vue";
const { x, y, sourceType } = useMouse();
const props = defineProps(["reviewType"]);
const emit = defineEmits(["updateTable"]);
let reviewType = props.reviewType;
const questions = ref(null);
const columns = ref(null);
const selectedRows = ref();
const showData = ref(false);

let questionData;
const viewData = (selectedRows) => {
  if (selectedRows != null) {
    showData.value = true;
    questionData = {
      info: selectedRows,
      showData: showData,
    };
  }
};

const updateCompletedReviews = () => {
  console.log("updating table... " + reviewType);
  var baseURI = null;
  if (reviewType == "Completed")
    baseURI = globals.serverUrl + "completedreviews";
  else if (reviewType == "InReview")
    baseURI = globals.serverUrl + "openreviews";
  else {
    alert(reviewType);
    return;
  }
  console.log(dataModel.currentUser);
  axios
    .post(baseURI, { userToken: dataModel.currentUser.userToken })
    .then((result) => {
      if (result.data != null) {
        questions.value = JSON.parse(JSON.stringify(result.data));
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
const updateTableInterval = () => {
  if (questions.value.length > 0 && reviewType === "InReview") {
    emit("updateTable");
    updateCompletedReviews();
  }
};
const updateTable = () => {
  updateCompletedReviews();
};
setInterval(updateTableInterval, 10000);
</script>

<template>
  <QuestionDetails
    v-if="showData"
    :data="questionData"
    :reviewType="reviewType"
    @update-table="updateTable"
  />

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
  background-color: rgb(0, 119, 255);
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
