<script setup>
import { ref, onMounted } from "vue";
import menuData from "../assets/menu.json";

const menuLabels = menuData.vehicles;

let showMenu = ref(false);
let showSubMenu = ref(false);

let vehicleHovered = ref(null);
const dropdownMenu = ref(null);
const closeButton = ref(null);
const dropDownButton = ref(null);
let showPopUp = ref(false);
const emit = defineEmits(["showLogin"]);
const props = defineProps({
  isLoggedIn: Boolean,
  userInfo: Object,
});
const showSubMenuTab = (e) => {
  vehicleHovered.value = e.target.outerText;
  showSubMenu.value = true;
};

const showDropDown = (event) => {
  event.stopPropagation();
  dropdownMenu.value.classList.add("show");
  closeButton.value.style.display = "block";
  dropDownButton.value.style.display = "none";
};

onMounted(() => {
  document.addEventListener("click", () => {
    if (dropdownMenu && dropdownMenu.value.classList.contains("show")) {
      dropdownMenu.value.classList.remove("show");
      dropDownButton.value.style.display = "block";
      closeButton.value.style.display = "none";
    }
  });
  window.addEventListener(
    "resize",
    (event) => {
      if (event.currentTarget.innerWidth > 620) {
        dropDownButton.value.style.display = "none";
        closeButton.value.style.display = "none";
        dropdownMenu.value.classList.remove("show");
      } else if (
        event.currentTarget.innerWidth < 620 &&
        !dropdownMenu.value.classList.contains("show")
      ) {
        dropDownButton.value.style.display = "block";
        closeButton.value.style.display = "none";
      }
    },
    true
  );
});

const showLogin = () => {
  emit("showLogin", true);
};
</script>

<template>
  <header
    @mouseleave="
      showMenu = false;
      showSubMenu = false;
    "
  >
    <svg
      class="logo"
      width="200"
      height="100"
      viewBox="0 0 300 80"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Car Body -->
      <path
        d="M30 70 C50 40, 200 40, 220 70 L230 75 L220 80 C200 85, 50 85, 30 80 L20 75 Z"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />

      <!-- Roof & Windows -->
      <path
        d="M60 50 Q100 20, 140 50"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path
        d="M65 50 L85 50"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path
        d="M115 50 L135 50"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />

      <!-- Wheels -->
      <circle
        cx="65"
        cy="85"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <circle
        cx="185"
        cy="85"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />

      <!-- Headlights -->
      <circle cx="20" cy="68" r="3" fill="currentColor" />
      <circle cx="230" cy="68" r="3" fill="currentColor" />

      <!-- Shop Name -->
    </svg>

    <menu class="nav">
      <ul>
        <li @mouseenter="showMenu = true">
          VEHICLES
          <div class="menu-list" v-show="showMenu">
            <div
              v-for="vehicle in Object.keys(menuLabels)"
              class="list-item"
              @mouseover="showSubMenuTab($event)"
            >
              {{ vehicle }}
            </div>
          </div>
          <div v-show="showSubMenu" class="sub-menu-list">
            <div
              v-for="brand in menuLabels[vehicleHovered]"
              class="sub-list-item"
            >
              {{ brand.name }}
            </div>
          </div>
        </li>
        <li>ABOUT</li>
        <li>SHOP</li>
        <li>CONTACT</li>
      </ul>
      <div class="menu-contents">
        <div class="menu-content"></div>
        <div class="menu-sub-content"></div>
      </div>
    </menu>
    <menu class="dropdown" ref="dropdownMenu">
      <ul>
        <li>VEHICLES</li>
        <li>ABOUT</li>
        <li>SHOP</li>
        <li>CONTACT</li>
      </ul>
    </menu>
    <div class="icons">
      <svg
        v-if="!isLoggedIn"
        class="login"
        xmlns="http://www.w3.org/2000/svg"
        fill="#FFF"
        height="30px"
        width="30px"
        viewBox="0 0 448 512"
        @click="showLogin"
      >
        <path
          d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
        />
      </svg>
      <div v-else class="user">
        <div>Current User : {{ userInfo.name }}</div>
      </div>
      <svg
        class="dropdown-button"
        ref="dropDownButton"
        height="30px"
        width="30px"
        fill="#FFF"
        @click="showDropDown($event)"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
        />
      </svg>
      <svg
        ref="closeButton"
        class="close-button"
        height="30px"
        width="30px"
        fill="#FFF"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path
          d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
        />
      </svg>
    </div>
    <!-- <div class="user-info" v-if="showPopUp">
      <div>Name: {{ userInfo.name }}</div>
      <div>Email: {{ userInfo.email }}</div>
    </div> -->
  </header>
</template>

<style>
.user {
  align-self: center;
}
</style>
