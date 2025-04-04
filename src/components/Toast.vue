<template>
  <div class="toast-container">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      :class="['toast', toast.type]"
      @click="removeToast(index)"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const toasts = ref([]);

const addToast = (message, type = "info", duration = 3000) => {
  const toast = { message, type };
  toasts.value.push(toast);

  setTimeout(() => {
    removeToast(0);
  }, duration);
};

const removeToast = (index) => {
  toasts.value.splice(index, 1);
};

defineExpose({ addToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 55px;
  right: -40px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.toast {
  padding: 10px 15px;
  border-radius: 2px;
  color: white;
  font-weight: normal;
  cursor: pointer;
  min-width: 200px;
  text-align: center;
  font-family: "Fira Sans";
}

.toast.info {
  background-color: #3498db;
}
.toast.success {
  background-color: white;
  color: black;
}
.toast.error {
  background-color: #e74c3c;
}
</style>
