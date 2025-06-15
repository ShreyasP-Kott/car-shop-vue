<script setup>
import { ref, onMounted } from "vue";
import menuData from "../assets/menu.json";
import { useRouter } from "vue-router";

const router = useRouter();
const menuLabels = menuData.vehicles;

let showMenu = ref(false);
let showSubMenu = ref(false);

let vehicleHovered = ref(null);
const dropdownMenu = ref(null);
const closeButton = ref(null);
const dropDownButton = ref(null);

const emit = defineEmits(["showLogin"]);
const props = defineProps({
  isLoggedIn: Boolean,
  userInfo: Object,
});
const showSubMenuTab = e => {
  vehicleHovered.value = e.target.outerText;
  showSubMenu.value = true;
};

const showDropDown = event => {
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
    event => {
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

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  emit("loggedIn", false);
  router.push("/");
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
      <path d="M60 50 Q100 20, 140 50" stroke="currentColor" stroke-width="4" fill="none" />
      <path d="M65 50 L85 50" stroke="currentColor" stroke-width="4" fill="none" />
      <path d="M115 50 L135 50" stroke="currentColor" stroke-width="4" fill="none" />

      <!-- Wheels -->
      <circle cx="65" cy="85" r="10" stroke="currentColor" stroke-width="4" fill="none" />
      <circle cx="185" cy="85" r="10" stroke="currentColor" stroke-width="4" fill="none" />

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
              :key="vehicle"
              class="list-item"
              @mouseenter="showSubMenuTab($event)"
            >
              {{ vehicle }}
              <div class="triangle-right"></div>
            </div>
          </div>
          <div v-show="showSubMenu" class="sub-menu-list">
            <div
              v-for="brand in menuLabels[vehicleHovered]"
              :key="brand.name"
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
        width="35px"
        height="35px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="showLogin"
      >
        <path
          d="M13 2C10.2386 2 8 4.23858 8 7C8 7.55228 8.44772 8 9 8C9.55228 8 10 7.55228 10 7C10 5.34315 11.3431 4 13 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H13C11.3431 20 10 18.6569 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 19.7614 10.2386 22 13 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H13Z"
          fill="#FFF"
        ></path>
        <path
          d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11.2821C11.1931 13.1098 11.1078 13.2163 11.0271 13.318C10.7816 13.6277 10.5738 13.8996 10.427 14.0945C10.3536 14.1921 10.2952 14.2705 10.255 14.3251L10.2084 14.3884L10.1959 14.4055L10.1915 14.4115C10.1914 14.4116 10.191 14.4122 11 15L10.1915 14.4115C9.86687 14.8583 9.96541 15.4844 10.4122 15.809C10.859 16.1336 11.4843 16.0346 11.809 15.5879L11.8118 15.584L11.822 15.57L11.8638 15.5132C11.9007 15.4632 11.9553 15.3897 12.0247 15.2975C12.1637 15.113 12.3612 14.8546 12.5942 14.5606C13.0655 13.9663 13.6623 13.2519 14.2071 12.7071L14.9142 12L14.2071 11.2929C13.6623 10.7481 13.0655 10.0337 12.5942 9.43937C12.3612 9.14542 12.1637 8.88702 12.0247 8.7025C11.9553 8.61033 11.9007 8.53682 11.8638 8.48679L11.822 8.43002L11.8118 8.41602L11.8095 8.41281C11.4848 7.96606 10.859 7.86637 10.4122 8.19098C9.96541 8.51561 9.86636 9.14098 10.191 9.58778L11 9C10.191 9.58778 10.1909 9.58773 10.191 9.58778L10.1925 9.58985L10.1959 9.59454L10.2084 9.61162L10.255 9.67492C10.2952 9.72946 10.3536 9.80795 10.427 9.90549C10.5738 10.1004 10.7816 10.3723 11.0271 10.682C11.1078 10.7837 11.1931 10.8902 11.2821 11H3Z"
          fill="#FFF"
        ></path>
      </svg>
      <div v-else class="user">
        <svg
          class="login"
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          height="22px"
          width="22px"
          viewBox="0 0 448 512"
        >
          <path
            d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
          />
        </svg>
        <div class="user-details">
          <div class="user-name">{{ userInfo.name }}</div>
          <div @click="logout">Logout</div>
        </div>
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
  </header>
</template>

<style lang="scss" scoped>
.user {
  display: flex;
  align-self: center;
  border-radius: 10px;
  position: relative;
  padding: 10px;
  &:hover {
    .user-details {
      display: block !important;
      position: absolute;
      top: 42px;
      background-color: #fff;
      color: black;
      width: max-content;
      right: 17px;
      padding-top: 5px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      z-index: 100;
      div {
        padding: 10px;
        border-radius: 5px;
        &:last-child {
          &:hover {
            background-color: #2377cc;
            color: white;
            border-radius: 0px 0px 5px 5px;
          }
        }
      }
    }
  }
  .user-details {
    display: none;
  }
}
svg.logout-button {
  align-self: center;
  justify-self: end;
  margin-right: 10px;
  width: auto;
}

.list-item {
  position: relative;
  padding-right: 20px; /* Add space for the triangle */
  &:hover {
    .triangle-right {
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 19px solid transparent;
      border-left: 15px solid dodgerblue;
      position: absolute;
      right: -10px;
      top: -50%;
      transform: translateY(50%);
    }
  }
}
</style>
