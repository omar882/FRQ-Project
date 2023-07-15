<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import axios from "axios";
import DeleteModal from "./DeleteModal.vue";

const emit = defineEmits(["updateTable"]);

const props = defineProps(["data", "reviewType"]);
let images = "";
if (props.data.info.answerFilesList) {
  images = props.data.info.answerFilesList.split(",");
  console.log(images);
}
const visible = ref(props.data.showData);
const reviewType = props.reviewType;
const showDeleteModal = ref(false);
let deleteModalData = {};
let DeleteModalKey = ref(0);
let header = "";

if (reviewType === "Completed") {
  header =
    props.data.info.subjectName +
    " Question" +
    " - " +
    props.data.info.reviewDate.substring(0, 10);
} else {
  header =
    props.data.info.subjectName +
    " Question" +
    " - " +
    props.data.info.submissionDate.substring(0, 10);
}
if (props.data.info.isAutoReview === 1) {
  header = header + " - AI Review";
}

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
    emit("updateTable");
    visible.value = false;
  });
};
const getImgUrl = (image) => {
  console.log(image);
  return new URL(image).href;
};
</script>

<template>
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
      <DeleteModal
        :data="deleteModalData"
        v-if="showDeleteModal"
        :key="DeleteModalKey"
        @delete="handleDelete"
      ></DeleteModal>

      <h2>
        <span> The Question was: </span>
      </h2>
      <span style="font-weight: initial" class="">
        {{ props.data.info.customQuestionText }}</span
      >

      <div v-if="props.data.info.answerFilesList">
        <h2>
          <span> Your Answer was: </span>
        </h2>
        <div class="flex flex-row">
          <Image alt="Image" preview v-for="image in images" class="mr-4">
            <template #indicatoricon>
              <i class="pi pi-check"></i>
            </template>
            <template #image>
              <img
                class="w-3rem mt-3"
                crossorigin="anonymous"
                :src="getImgUrl(image)"
                alt="image"
              />
            </template>
            <template #preview="slotProps">
              <div class="flex justify-content-center">
                <img
                  crossorigin="anonymous"
                  class="w-6 justify-"
                  :src="getImgUrl(image)"
                  alt="preview"
                  :style="slotProps.style"
                  @click="slotProps.onClick"
                />
              </div>
            </template>
          </Image>
        </div>
      </div>

      <h2 v-if="reviewType === 'Completed'">
        <span>Your Answer was: </span>
      </h2>
      <span style="font-weight: initial">
        {{ props.data.info.userAnswer }}</span
      >
      <div
        v-if="
          reviewType === 'Completed' && props.data.info.isAutoReview == true
        "
      >
        <h2>
          <span>Feedback: </span>
        </h2>
        <span style="font-weight: initial">
          {{ props.data.info.autoReviewAnswer }}</span
        >
      </div>
      <div
        v-if="
          reviewType === 'Completed' && props.data.info.isAutoReview == false
        "
      >
        <h2>
          <span>Teacher Feedback: </span>
        </h2>
        <div v-html="props.data.info.reviewAnswer"></div>
      </div>
      <template #footer>
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
