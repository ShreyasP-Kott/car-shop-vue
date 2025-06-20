import "vue-multiselect/dist/vue-multiselect.min.css"
import "./assets/main.scss";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

createApp(App).use(router).mount("#app");
