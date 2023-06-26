import { reactive } from "vue";

export const dataModel = reactive({
  currentUser: null,
  recentlyAddedItemsForReview: [],
  subjects: null,
});

export const globals = reactive({
  serverUrl: "http://127.0.0.1:3001/",
});
