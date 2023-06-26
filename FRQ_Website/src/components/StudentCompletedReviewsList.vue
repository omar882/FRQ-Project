
<script setup>
    defineProps({
    })


</script>

<script>
    import axios from 'axios'
    import { globals, dataModel } from '../dataModel.js'
    import { ref } from "vue";

    export default {

        data() {
            return {
                globals,
                dataModel,
    products,
    columns
            }
        },
        methods: {
            addNewReview() {
                this.newReviewDialogVisible = true;
            }
            },
    created() {
        this.columns = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    },
    mounted() {
        products = [{code: '123', name:'123', category:'123', quantity:'123'}, {code: '123', name:'123', category:'123', quantity:'123'}];
    }
    }

</script>

<template>
       <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
    </div>
</template>
