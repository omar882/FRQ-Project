/*
    ,
    props: {
        reviewTyp: String
    },
    methods: {
        addNewReview() {
        },
        updateCompletedReviews() {
            //alert(this.reviewType);

            const baseURI = globals.serverUrl + "completedreviews";
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
        alert("Hi");
        this.columns = [
            { field: 'submissionDate', header: 'Date' },
            { field: 'subjectId', header: 'Subject' },
            { field: 'customQuestionText', header: 'Question' }
        ];
    },
    mounted() {
        alert("Hi");
        this.updateCompletedReviews();
        //this.questions = [{ code: '123', name: '123', category: '123', quantity: '123' }, { code: '123', name: '123', category: '123', quantity: '123' }];
        //alert(JSON.stringify(this.products));
    }
    */




    <!--
    <div class="card">
        <DataTable :value="questions" tableStyle="min-width: 50rem">
            <Column field="date" header="Date" style="min-width: 200px">
                <template #body="{ data }">
                    {{ formatDate(data.submissionDate) }}
                </template>
            </Column>
            <Column field="subjectName" header="Subject" style="min-width: 200px"></Column>
            <Column field="customQuestionText" header="Question" style="min-width: 200px"></Column>
        </DataTable>
    </div>
    -->