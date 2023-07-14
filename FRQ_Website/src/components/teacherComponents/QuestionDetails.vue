<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import axios from "axios";
import { useToast } from "primevue/usetoast";
const quillModules = {
  ImageResize: {
    modules: ["Resize", "DisplaySize", "Toolbar"],
  },
};

const toast = useToast();
const confirm = useConfirm();
const showAddReview = ref(false);
const emit = defineEmits(["updateTable"]);
let header =
  props.data.info.subjectName +
  " Question" +
  " - " +
  props.data.info.submissionDate.substring(0, 10);

if (props.data.info.isAutoReview === 1) {
  header = header + " - AI Review";
}
const props = defineProps(["data", "reviewType"]);
const visible = ref(props.data.showData);
const reviewType = props.reviewType;

const confirmSelect = () => {
  console.log("in");
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "A new review has been added to your active reviews",
        life: 3000,
      });
      selectReview();
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};
const selectReview = () => {
  console.log(props.data.info);

  let baseURI = globals.serverUrl + "assignreview";
  axios
    .post(baseURI, {
      teacherId: dataModel.currentUser.teacherId,
      questionId: props.data.info.id,
    })
    .then((result) => {
      visible.value = false;
      emit("updateTable");
    });
};
const toggleAddReview = () => {
  showAddReview.value = !showAddReview.value;
};
const buttonText = ref("Start Review");
const reviewText = ref("");
watch(reviewText, () => {
  console.log(reviewText.value);
  if (reviewText.value != "") {
    buttonText.value = "Continue Review";
  } else {
    buttonText.value = "Start Review";
  }
});
console.log(props.data.info);
const editorValue = ref(props.data.info.reviewAnswer);
const postReview = () => {
  const baseURI = globals.serverUrl + "postteacherreview";

  axios
    .post(baseURI, {
      questionId: props.data.info.id,
      questionAnswer: reviewText.value,
    })
    .then((result) => {
      visible.value = false;

      emit("updateTable");
    });
};
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <Dialog
    maximizable
    :draggable="true"
    :style="{ width: '70vw' }"
    v-model:visible="showAddReview"
    appendToBody="true"
  >
    <template #header>
      <h2 class="m-0 p-0 flex justify-content-center text-center w-full">
        Grading FRQ
      </h2>
    </template>
    <div style="height: 30vw">
      <label
        >Please grade the student's review based on the appropriate rubric and
        provide feedback.
      </label>
      <Editor
        v-model="reviewText"
        editorStyle="height: 320px"
        class="mt-3"
        :modules="quillModules"
      >
      </Editor>
    </div>

    <template #footer>
      <Button label="Submit" icon="pi pi-upload" @click="postReview" />
    </template>
  </Dialog>
  <div class="card flex">
    <Dialog
      maximizable
      :draggable="false"
      v-model:visible="visible"
      modal
      :style="{ width: '70vw', height: '' }"
    >
      <template #header>
        <div
          class="flex flex-row align-items-start justify-content-center w-full h-full"
        >
          <h2 class="m-0 h-full align-self-start justify-content-center">
            {{ header }}
          </h2>
        </div>
      </template>

      <h2>
        <span> The Question was: </span>
      </h2>
      <span style="font-weight: initial" class="">
        {{ props.data.info.customQuestionText }}</span
      >
      <div v-if="props.data.info.userAnswer">
        <h2>
          <span> The Student's answer was: </span>
        </h2>
        <span style="font-weight: initial" class="">
          {{ props.data.info.userAnswer }}</span
        >
      </div>
      <div v-if="props.data.info.reviewAnswer">
        <h2>
          <span> Your feedback was: </span>
        </h2>
        <span style="font-weight: initial" class=""></span>
        <div v-html="editorValue"></div>
      </div>
      <template #footer>
        <div class="flex flex-wrap justify-content-between">
          <Button
            label="Close"
            icon="pi pi-times"
            @click="visible = false"
            text
            justify-content-end
          />
          <Button
            v-if="reviewType == 'InReview'"
            label="Select Review"
            icon=""
            @click="confirmSelect"
            text
            justify-content-end
          />
          <Button
            v-if="reviewType == 'Active'"
            :label="buttonText"
            icon=""
            @click="toggleAddReview"
            text
            justify-content-end
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
