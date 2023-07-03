<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
const props = defineProps(["data"]);
const visible = ref(props.data.showDeleteModal);
const emit = defineEmits(["delete"]);
let test = true;
const handleDelete = () => {
  visible.value = false;
  emit("delete");
};
</script>

<template>
  <div class="card flex">
    <Dialog
      v-model:visible="visible"
      modal
      :header="'Are you sure you want to delete?'"
      :style="{ width: '30vw', height: '' }"
    >
      <template #footer>
        <p>{{}}</p>

        <div class="flex flex-wrap justify-content-between">
          <Button class="color-red" label="No" text @click="visible = false" />
          <Button
            label="Yes"
            text
            justify-content-end
            style="color: red"
            @click="handleDelete"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
