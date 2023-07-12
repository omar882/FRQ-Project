<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import axios from "axios";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const confirm = useConfirm();
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
      emit("updateTable");
    });
};
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
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
        <span> The Question is: </span>
      </h2>
      <span style="font-weight: initial" class="">
        {{ props.data.info.customQuestionText }}</span
      >

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
        </div>
      </template>
    </Dialog>
  </div>
</template>
