<script>
import { globals, dataModel } from '../dataModel.js'
import axios from 'axios'
import { ref } from "vue";

export default {
    data() {
        return {
            globals,
            dataModel,
            questions: null,
            columns: null
        }
    },
    props: {
        reviewType: String
    },
    methods: {
        addNewReview() {
        },
        updateCompletedReviews() {
            var baseURI = null;
            if (this.reviewType == "Completed")
                baseURI = globals.serverUrl + "completedreviews";
            else if (this.reviewType == "InReview")
                baseURI = globals.serverUrl + "openreviews";
            else {
                alert(this.reviewType);
                return;
            }

            axios.post(baseURI, { userToken: dataModel.currentUser.userToken })
                .then((result) => {
                    //alert(JSON.stringify(result.data));

                    if (result.data != null) {
                        //this.subjects = result.data;
                        this.questions = JSON.parse(JSON.stringify(result.data));
                    }

                });
        },
        formatDate(dateField) {
            var date = new Date(dateField);
            return date.toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
        }
    },
    created() {
        this.columns = [
            { field: 'submissionDate', header: 'Date' },
            { field: 'subjectId', header: 'Subject' },
            { field: 'customQuestionText', header: 'Question' }
        ];
    },
    mounted() {
        this.updateCompletedReviews();
        //this.questions = [{ code: '123', name: '123', category: '123', quantity: '123' }, { code: '123', name: '123', category: '123', quantity: '123' }];
        //alert(JSON.stringify(this.products));
    }   
}
</script>

<template>
    <div class="card">
        <DataTable v-if="reviewType == 'InReview'" :value="questions" tableStyle="min-width: 50rem">
            <Column field="date" header="Date" style="min-width: 200px" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.submissionDate) }}
                </template>
            </Column>
            <Column field="subjectName" header="Subject" style="min-width: 200px"></Column>
            <Column field="customQuestionText" header="Question" style="min-width: 200px"></Column>
        </DataTable>

        <DataTable v-else="reviewType == 'Completed'" :value="questions" tableStyle="min-width: 50rem">
            <Column field="date" header="Date" style="min-width: 200px" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.submissionDate) }}
                </template>
            </Column>
            <Column field="subjectName" header="Subject" style="min-width: 200px"></Column>
            <Column field="customQuestionText" header="Question" style="min-width: 200px"></Column>
        </DataTable>
    </div>
</template>
