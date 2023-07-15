<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { globals, dataModel } from "../../dataModel.js";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";
import axios from "axios";
import { useToast } from "primevue/usetoast";
let answerImages = "";
let reviewImages = "";
let questionImages = "";

const files = ref([]);
const uploadControl = ref(null);
const fileUploader = ref(null);
console.log(props.data.info.questionFileList);
if (props.data.info.answerFilesList) {
  answerImages = props.data.info.answerFilesList.split(",");
}
if (props.data.info.reviewFileList) {
  reviewImages = props.data.info.reviewFileList.split(",");
}
if (props.data.info.questionFileList) {
  questionImages = props.data.info.questionFileList.split(",");
  console.log(questionImages);
}
function trim(str, ch) {
  var start = 0,
    end = str.length;

  while (start < end && str[start] === ch) ++start;

  while (end > start && str[end - 1] === ch) --end;

  return start > 0 || end < str.length ? str.substring(start, end) : str;
}
var toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],

  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
];
const quillModules = {
  toolbar: toolbarOptions,
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
const reviewText = ref();
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
      fileUploader.value.upload();
      visible.value = false;

      emit("updateTable");
    });
};
const getImgUrl = (image) => {
  console.log(image);
  return new URL(image).href;
};
function onAdvancedUpload() {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
}
const onSelectedFiles = (event) => {
  files.value = event.files;
  //alert(JSON.stringify(event));
  uploadControl.value = event.src;
};
const beforeUpload = (request) => {
  console.log("in");
  request.xhr.setRequestHeader("qId", props.data.info.id);

  return request;
};
const uploadProgress = (progress) => {};
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
    <div class="">
      <label
        >Please grade the student's FRQ based on the appropriate rubric and
        provide feedback.
      </label>
      <Editor
        v-model="reviewText"
        editorStyle="height: 320px"
        class="mt-3"
        :modules="quillModules"
      >
        <template v-slot:toolbar>
          <span class="ql-formats"> </span>
        </template>
      </Editor>
    </div>
    <FileUpload
      class="flex mt-1"
      ref="fileUploader"
      name="files"
      url="http://127.0.0.1:3001/uploadreview"
      @upload="onAdvancedUpload($event)"
      :multiple="true"
      accept="image/*"
      :maxFileSize="1000000"
      :showUploadButton="false"
      :showCancelButton="false"
      @select="onSelectedFiles"
      :auto="false"
      @before-send="beforeUpload"
      @progress="uploadProgress"
    >
    </FileUpload>
    <template #footer>
      <div class="flex justify-content-end">
        <Button label="Submit" icon="pi pi-upload" @click="postReview" />
      </div>
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
      <div class="flex flex-row">
        <Image alt="Image" preview v-for="image in questionImages" class="mr-4">
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
      <div v-if="props.data.info.userAnswer || props.data.info.answerFilesList">
        <h2>
          <span> The Student's answer was: </span>
        </h2>

        <span style="font-weight: initial" class="">
          {{ props.data.info.userAnswer }}</span
        >
        <div class="flex flex-row">
          <Image alt="Image" preview v-for="image in answerImages" class="mr-4">
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
      <div v-if="props.data.info.reviewAnswer">
        <h2>
          <span> Your feedback was: </span>
        </h2>
        <span style="font-weight: initial" class=""></span>
        <div v-html="trim(editorValue, '\'')"></div>
        <Image alt="Image" preview v-for="image in reviewImages" class="mr-4">
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
