<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <div class="header-section">
        <h2 class="modal-title">Please login to continue</h2>
        <i
          @click="closeModal"
          class="fa fa-times close-btn"
          aria-hidden="true"
        ></i>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            ref="emailRef"
            v-model="email"
            type="email"
            id="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <button type="submit" class="btn">LOGIN</button>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  errorMessage: String,
  clearForm: Boolean,
});
const emit = defineEmits(["close", "login"]);

const email = ref("");
const password = ref("");

const handleLogin = () => {
  emit("login", { email: email.value, password: password.value });
};

const closeModal = () => {
  emit("close");
  email.value = "";
  password.value = "";
};

watch(
  () => props.clearForm,
  (value) => {
    if (value) closeModal();
  }
);
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.modal-container {
  background: #fff;
  color: black;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 350px;
  font-family: "Fira Sans";
}

.modal-title {
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 15px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Fira Sans";
  letter-spacing: 5px;
}

.btn:hover {
  background: #0056b3;
}

.close-btn {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  color: black;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  h2,
  button {
    margin: 0;
  }
}
.error {
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
  color: lightcoral;
}
</style>
