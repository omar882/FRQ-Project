<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { globals, dataModel } from "../dataModel.js";
import axios from "axios";
const emit = defineEmits(["updateTable"]);

const props = defineProps(["data", "reviewType"]);
const visible = ref(props.data.showData);
const reviewType = props.reviewType;
import DeleteModal from "@/components/DeleteModal.vue";
const showDeleteModal = ref(false);
let deleteModalData = {};
let DeleteModalKey = ref(0);
const viewDeleteModal = () => {
  DeleteModalKey.value++;
  showDeleteModal.value = true;

  deleteModalData = {
    showDeleteModal: showDeleteModal.value,
    modal: props.data.info,
  };
};
const handleDelete = () => {
  DeleteModalKey.value++;
  let id = props.data.info.id;
  console.log("deleting...");
  var baseURI = globals.serverUrl + "removeFRQ";

  axios.post(baseURI, { id: id }).then((result) => {
    console.log(result + " I hope it worked");
    console.log("this should be before update table");
    console.log("table should have been updated");
    emit("updateTable");
    visible.value = false;
  });
};
</script>

<template>
  <div class="card flex">
    <Dialog
      :draggable="false"
      v-model:visible="visible"
      modal
      :header="props.data.info.subjectName + ' Question'"
      :style="{ width: '50vw', height: '' }"
    >
      <DeleteModal
        :data="deleteModalData"
        v-if="showDeleteModal"
        :key="DeleteModalKey"
        @delete="handleDelete"
      ></DeleteModal>

      <h3>
        <span> The Question is: </span>
        <span style="font-weight: initial">
          {{ props.data.info.customQuestionText }}</span
        >
      </h3>
      <h3>
        <span>Your Answer was: </span>
        <span style="font-weight: initial">
          {{ props.data.info.userAnswer }}</span
        >
      </h3>
      <h3 v-if="reviewType === 'Completed'">
        <span>Feedback: </span>
        <span style="font-weight: initial">
          {{ props.data.info.autoReviewAnswer }}</span
        >
      </h3>

      <template #footer>
        <p>{{ props.data.info.submissionDate.substring(0, 10) }}</p>

        <div class="flex flex-wrap justify-content-between">
          <Button
            @click="viewDeleteModal()"
            style="color: red"
            class="color-red"
            label="Delete"
            icon="pi pi-delete-left"
            text
          />
          <Button
            label="Close"
            icon="pi pi-times"
            @click="visible = false"
            text
            justify-content-end
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
