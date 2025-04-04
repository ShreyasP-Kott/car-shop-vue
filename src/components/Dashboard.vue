<!-- components/CarDashboard.vue -->
<template>
  <div v-if="!isLoading && !errorMessage" class="dashboard">
    <aside class="filters">
      <h3>Filters</h3>

      <label>
        Model:
        <select v-model="filters.model">
          <option value="">All</option>
          <option v-for="model in uniqueModels" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
      </label>

      <label>
        Min Year:
        <input type="number" v-model.number="filters.minYear" />
      </label>

      <label>
        Max Mileage:
        <input type="number" v-model.number="filters.maxMileage" />
      </label>

      <button @click="resetFilters">Reset</button>
    </aside>

    <main class="car-list">
      <CarCard v-for="car in filteredCars" :key="car.id" :car="car" />
      <p v-if="filteredCars.length === 0">
        No cars found matching the criteria.
      </p>
    </main>
  </div>
  <div v-else-if="errorMessage" class="error">
    <div>
      {{ errorMessage }}
    </div>
  </div>
  <div v-else="isLoading" class="loader">Loading...</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import CarCard from "./CarCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cars = ref(null);
let isLoading = ref(true);
let errorMessage = ref(null);

const emit = defineEmits(["openLoginModal", "isLoggedIn"]);
const props = defineProps({
  isLoggedIn: Boolean,
});

watch(
  () => props.isLoggedIn,
  (value) => (value ? fetchCars() : null)
);
const fetchCars = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const response = await fetch("https://localhost:7154/api/cars/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ← token from login response or localStorage
      },
    });

    if (!response.ok) {
      throw new Error("An error is encountered. Please login again...");
    }

    cars.value = await response.json();
    isLoading.value = false;
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.message;
    isLoading.value = false;
    emit("isLoggedIn", false);
    emit("openLoginModal", true);
  }
};
onMounted(async () => {
  fetchCars();
});
// Sample cars data
// cars = ref([
//   { id: 1, model: "Toyota", year: 2020, mileage: 20000 },
//   { id: 2, model: "Honda", year: 2018, mileage: 40000 },
//   { id: 3, model: "Tesla", year: 2022, mileage: 10000 },
//   { id: 4, model: "Ford", year: 2019, mileage: 35000 },
// ]);

const filters = ref({
  model: "",
  minYear: "",
  maxMileage: "",
});

const uniqueModels = computed(() => {
  return [...new Set(cars.value.map((car) => car.model))];
});

const filteredCars = computed(() => {
  return cars.value.filter((car) => {
    const matchModel = filters.value.model
      ? car.model === filters.value.model
      : true;
    const matchYear = filters.value.minYear
      ? car.year >= filters.value.minYear
      : true;
    const matchMileage = filters.value.maxMileage
      ? car.mileage <= filters.value.maxMileage
      : true;
    return matchModel && matchYear && matchMileage;
  });
});

const resetFilters = () => {
  filters.value = { model: "", minYear: "", maxMileage: "" };
};
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #e5e7eb;
  color: black;
  min-height: 100vh;
}

.filters {
  width: 200px;
  /* border-right: 2px solid #ccc; */
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative; /* Enable positioning for the pseudo-element */
  padding-right: 20px; /* Add some space so the content doesn't overlap the gradient */
}
.error {
  min-height: 100vh;
  text-align: center;
  display: flex;
  justify-content: center;
  div {
    align-self: center;
    justify-self: center;
  }
}
.loader {
  min-height: 100vh;
}
.filters::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 2px; /* Maximum thickness in the center */
  height: 100%;
  /* The gradient makes it opaque (white) at the middle (50%) and transparent at the top and bottom */
  background: linear-gradient(
    to bottom,
    transparent 0%,
    white 50%,
    transparent 100%
  );
  pointer-events: none; /* Allow clicks through the pseudo-element */
}

.car-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
