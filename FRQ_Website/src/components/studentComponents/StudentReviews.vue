<script setup>
import axios from "axios";
import { globals, dataModel } from "../../dataModel.js";
import { ref, defineProps, onMounted, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import StudentReviewsTable from "./StudentReviewsTable.vue";

const emit = defineEmits(["updateTable"]);
const props = defineProps(["reviewType"]);
const router = useRouter();
const toast = useToast();
let reviewType = props.reviewType;
const questionList = ref(null);
const isCustom = ref(false);
const isAutoReview = ref(false);
const newReviewDialogVisible = ref(false);
const urgencyOptions = ref([
  { name: "Urgent within 24 hours", value: 1 },
  { name: "Normal Within 3 days", value: 2 },
]);
const studentTable = ref(0);
const urgencySelection = ref({ name: "Urgent within 24 hours", value: 1 });
const questions = ref([
  { name: "Question 1", value: 1 },
  { name: "Question 2", value: 2 },
  { name: "Question 3", value: 3 },
]);
const selectedQuestion = ref({ name: "Question 1", value: 1 });
const years = ref([
  { name: "2022", value: 1 },
  { name: "2021", value: 2 },
  { name: "2020", value: 3 },
]);
const selectedSubjectYear = ref({ name: "2022", value: 1 });
const subjects = ref([]);
const selectedSubject = ref(null); //{ name: 'AP English', code: 'AP_ENG' },//dataModel.subjects[0], //{ name: 'AP English', code: 'AP_ENG' },
const customQuestionText = ref("");
const files = ref([]);
const uploadControl = ref(null);
const serverGeneratedReviewId = ref(null);
const customQuestionAnswer = ref("");
const fileUploader = ref(null);
const questionId = ref(null);
//reviewType: String,

const addNewReview = () => {
  newReviewDialogVisible.value = true;
};
function onAdvancedUpload() {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
}
function submit() {
  const baseURI = globals.serverUrl + "postreview";

  var reqBody = {
    userToken: dataModel.currentUser.userToken,
    isCustom: isCustom.value,
    isAutoReview: isAutoReview.value,
    urgencySelection: urgencySelection.value,
    selectedQuestion: selectedQuestion.value,
    selectedSubjectYear: selectedSubjectYear.value,
    selectedSubject: selectedSubject.value,
    customQuestionText: customQuestionText.value,
    userAnswer: customQuestionAnswer.value,
  };

  axios.post(baseURI, reqBody).then((result) => {
    console.log(result);
    if (result.data != null) {
      serverGeneratedReviewId.value = result.data.serverGeneratedReviewId;

      if (files.value.length > 0 && !isAutoReview.value) {
        console.log("in");
        questionId.value = result.data.qId;
        fileUploader.value.upload();
        newReviewDialogVisible.value = false;

        questionList.value.updateCompletedReviews();
        studentTable.value++;
      } else {
        console.log("int");

        //dataModel.recentlyAddedItemsForReview.push(itemToBeReviewed);
        newReviewDialogVisible.value = false;
        questionList.value.updateCompletedReviews();
        studentTable.value++;
      }
    }
  });
}
const beforeUpload = (request) => {
  console.log("in");
  request.xhr.setRequestHeader("qId", questionId.value);

  console.log(request);
  request.xhr.setRequestHeader(
    "serverGeneratedReviewId",
    serverGeneratedReviewId.value
  );

  return request;
};
const uploadProgress = (progress) => {
  //alert(JSON.stringify(progress));
  if (progress.progress == 100) {
    var itemToBeReviewed = {
      userToken: dataModel.currentUser.userToken,
      isCustom: isCustom.value,
      isAutoReview: isAutoReview.value,
      urgencySelection: urgencySelection.value,
      selectedQuestion: selectedQuestion.value,
      selectedSubjectYear: selectedSubjectYear.value,
      selectedSubject: selectedSubject.value,
      customQuestionText: customQuestionText.value,
      serverGeneratedReviewId: serverGeneratedReviewId.value,
    };

    dataModel.recentlyAddedItemsForReview.push(itemToBeReviewed);
    newReviewDialogVisible.value = false;
  }
};
const onSelectedFiles = (event) => {
  files.value = event.files;
  //alert(JSON.stringify(event));
  uploadControl.value = event.src;
};
const loadData = () => {
  const baseURI = globals.serverUrl + "subjects";
  axios
    .post(baseURI, { userToken: dataModel.currentUser.userToken })
    .then((result) => {
      //alert(JSON.stringify(result.data));
      if (result.data != null) {
        subjects.value = result.data;
      }
    });
};

const getTitle = () => {
  //console.log(reviewType);
  if (reviewType == "Completed") {
    return "My Completed Reviews";
  }
  return "My Open Reviews";
};

onMounted(() => {
  loadData();
  //alert("review mounted");
  //alert(dataModel.subjects +"  " +JSON.stringify(dataModel.subjects));
});
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
          <StudentReviewsTable
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
      >
        <Button
          v-if="reviewType !== 'Completed'"
          label="New Review"
          @click="newReviewDialogVisible = true"
        ></Button>
      </div>
    </Fieldset>

    <Dialog
      v-model:visible="newReviewDialogVisible"
      modal
      header="Create New Review"
      :style="{ width: '80vw' }"
      appendToBody="true"
    >
      <div class="card flex justify-content-left flex-column gap-2">
        <Dropdown
          v-model="selectedSubject"
          :options="subjects"
          optionLabel="name"
          placeholder="Select a Subject"
          :class="['w-full md:w-14rem']"
        />

        <SelectButton v-model="value" aria-labelledby="basic" />

        <div class="card flex justify-content-left">
          <div class="flex align-items-left">
            <Checkbox
              v-model="isCustom"
              inputId="officialQuestion"
              :binary="true"
              name="isCustomQuestion"
              @click="questionTypeChange"
            />
            <label for="officialQuestion" class="ml-2"
              >Is Custom Question?</label
            >
          </div>
        </div>

        <div
          div
          class="card flex justify-content-left flex-column gap-2"
          v-if="!isCustom"
        >
          <Dropdown
            v-model="selectedSubjectYear"
            :options="years"
            optionLabel="name"
            placeholder="Select a Year"
            class="w-full md:w-14rem"
          />
          <Dropdown
            v-model="selectedQuestion"
            :options="questions"
            optionLabel="name"
            placeholder="Select a Question"
            class="w-full md:w-14rem"
          />
        </div>

        <div div class="card flex justify-content-left" v-if="isCustom">
          <Textarea v-model="customQuestionText" rows="5" style="width: 100%" />
        </div>

        <div class="card flex justify-content-left">
          <div class="flex align-items-left">
            <Checkbox
              v-model="isAutoReview"
              inputId="autoReview"
              :binary="true"
              name="isAutoReview"
              @click="!isAutoReview"
            />
            <label for="autoReview" class="ml-2"
              >Do you want to use auto review?</label
            >
          </div>
        </div>

        <div class="card flex justify-content-left" v-if="!isAutoReview">
          <SelectButton
            v-model="urgencySelection"
            :options="urgencyOptions"
            optionLabel="name"
            aria-labelledby="basic"
          />
        </div>

        <div v-if="!isAutoReview">
          <Divider align="center" type="solid">
            <b>My Answer Attachments</b>
          </Divider>
          <div class="card">
            <FileUpload
              ref="fileUploader"
              name="files"
              url="http://127.0.0.1:3001/upload"
              @upload="onAdvancedUpload(event)"
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
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
          </div>
        </div>

        <div v-if="isAutoReview">
          <Divider align="center" type="solid">
            <b> Your Answer </b>
          </Divider>
          <div div class="card flex justify-content-left">
            <Textarea
              v-model="customQuestionAnswer"
              rows="5"
              style="width: 100%"
            />
          </div>
        </div>

        <Button label="Submit" @click="submit"></Button>
      </div>
    </Dialog>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 35rem;
}
</style>
