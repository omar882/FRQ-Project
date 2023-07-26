<script setup>
import { globals, dataModel } from "../../dataModel.js";
import axios from "axios";
import {
  onBeforeUnmount,
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
const questions = ref([]);
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

const updateReviews = () => {
  questions.value = [];
  var baseURI = null;
  let subjects = [];
  baseURI = globals.serverUrl + "teachersubjects";
  axios
    .post(baseURI, { userToken: dataModel.currentUser.userToken })
    .then((result) => {
      subjects = result.data;

      console.log("in " + reviewType);
      if (reviewType == "Completed") {
        baseURI = globals.serverUrl + "teachercompletedreviews";
        axios
          .post(baseURI, { teacherId: dataModel.currentUser.teacherId })
          .then((result) => {
            if (result.data != null) {
              console.log(result.data);
              result.data.forEach((question) => {
                questions.value.push(question);
                console.log(questions.value);
              });
              questions.value.sort((a, b) => {
                console.log(a.reviewDate);
                return a.reviewDate < b.reviewDate;
              });
            }
          });
      } else if (reviewType == "InReview") {
        baseURI = globals.serverUrl + "teacheropenreviews";
        // Change this so it queries the database once with sql join
        subjects.forEach((subject) => {
          axios
            .post(baseURI, { subjectId: subject.subjectId })
            .then((result) => {
              if (result.data != null) {
                //console.log(JSON.parse(JSON.stringify(result.data)));
                result.data.forEach((question) => {
                  questions.value.push(question);
                });
              }
            });
        });
      } else if (reviewType == "Active") {
        baseURI = globals.serverUrl + "teacheractivereviews";
        // Change this so it queries the database once with sql join
        console.log("teacherId: ");
        console.log(dataModel.currentUser);
        axios
          .post(baseURI, { teacherId: dataModel.currentUser.teacherId })
          .then((result) => {
            if (result.data != null) {
              console.log(result.data);
              result.data.forEach((question) => {
                questions.value.push(question);
                console.log(questions.value);
              });
            }
          });
      } else {
        alert(reviewType);
        return;
      }
    });
};

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
  updateReviews();
});

const updateTable = () => {
  updateReviews();
};
const interval = setInterval(updateTable, 30000);
onBeforeUnmount(() => {
  clearInterval(interval);
});
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

tr:hover {
  background-color: #eceef1;
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
