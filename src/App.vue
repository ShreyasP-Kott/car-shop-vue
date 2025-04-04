<script setup>
import Header from "./components/Header.vue";
import Carousel from "./components/Carousel.vue";
import Footer from "./components/Footer.vue";
import LoginModal from "./components/LoginModal.vue";
import Toast from "./components/Toast.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let isOpen = ref(false);
let errorMessage = ref(null);
let isLoggedIn = ref(null);
const toastRef = ref(null);
let clearForm = ref(false);
const userInfo = ref(null);
watch(isLoggedIn, (value) => {
  console.log(value);
});
const handleLogin = async (loginData) => {
  try {
    const response = await fetch("https://localhost:7154/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid login credentials");
    } else {
      isOpen.value = false;
      clearForm.value = true;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    router.push("/list");
    isLoggedIn.value = true;
    userInfo.value = { ...data.user };
    // showToast(data.message, "success");
  } catch (error) {
    errorMessage.value = error.message;
  }
};
const handleClose = () => {
  isOpen.value = false;
  errorMessage.value = "";
};
const showToast = (message, type) => {
  toastRef.value?.addToast(message, type);
};
</script>

<template>
  <Header
    @showLogin="(value) => (isOpen = value)"
    :isLoggedIn="isLoggedIn"
    :userInfo="userInfo"
  ></Header>
  <router-view
    @openLoginModal="(value) => (isOpen = value)"
    :isLoggedIn="isLoggedIn"
    @isLoggedIn="(value) => (isLoggedIn = value)"
  />
  <Footer></Footer>
  <LoginModal
    :isOpen="isOpen"
    @close="handleClose"
    @login="(data) => handleLogin(data)"
    :errorMessage="errorMessage"
    :clearForm="clearForm"
  />
  <Toast ref="toastRef" />
</template>

<style scoped lang="scss"></style>
