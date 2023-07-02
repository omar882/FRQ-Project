<script setup>
import axios from "axios";
import { globals, dataModel } from "../dataModel.js";
import { ref, onMounted } from "vue";

const products = ref(null);
const columns = ref(null);

const addNewReview = () => {
  newReviewDialogVisible.value = true;
};

const created = () => {
  columns.value = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "category", header: "Category" },
    { field: "quantity", header: "Quantity" },
  ];
};
created();
onMounted(() => {
  products.value = [
    { code: "123", name: "123", category: "123", quantity: "123" },
    { code: "123", name: "123", category: "123", quantity: "123" },
  ];
});
</script>

<template>
  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      ></Column>
    </DataTable>
  </div>
</template>
