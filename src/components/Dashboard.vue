<!-- components/CarDashboard.vue -->
<template>
  <div v-if="!isLoading && !errorMessage" class="dashboard">
    <aside class="filters">
      <h3>Filters</h3>

      <div class="form-group">
        <label class="form-label">Make:</label>
        <Multiselect
          v-model="filters.make"
          :options="uniqueMakes"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          placeholder="Pick a make"
          aria-label="pick a value"
        ></Multiselect>
      </div>

      <div class="form-group">
        <label class="form-label">Min Year:</label>
        <input type="number" v-model.number="filters.minYear" />
      </div>
      <div class="form-group">
        <label class="form-label">Max Mileage:</label>
        <input type="number" v-model.number="filters.maxMileage" />
      </div>
      <div class="form-group">
        <label class="form-label">Max Price:</label>
        <input type="number" v-model.number="filters.maxPrice" />
      </div>

      <div class="form-group">
        <label class="form-label">Features:</label>
        <Multiselect
          id="tagging"
          v-model="filters.selectedFeatures"
          placeholder="Search a feature"
          label="name"
          track-by="name"
          :show-labels="false"
          :options="
            cars
              .flatMap(car => car.features)
              .map(feature => {
                return { name: feature };
              })
              .filter(
                feature => filters.selectedFeatures.findIndex(f => f.name === feature.name) === -1
              )
          "
          :multiple="true"
          :taggable="true"
          @tag="addTag"
        ></Multiselect>
      </div>

      <div class="form-group">
        <label class="form-label">Fuel type:</label>
        <Multiselect
          v-model="filters.selectedFuelType"
          :options="fuelTypeOptions"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          placeholder="Pick a fuel type"
          aria-label="pick a value"
        ></Multiselect>
      </div>

      <button class="reset-button" @click="resetFilters">Reset</button>
    </aside>
    <main class="car-list">
      <div class="header-container">
        <h3 class="header-text">List of Pre-owned cars:</h3>
        <button class="add-car" @click="showCarModal = true">Add New Car</button>
      </div>
      <div class="car-grid">
        <CarCard v-for="car in filteredCars" :key="car.id" :car="car" />
        <p v-if="filteredCars.length === 0">No cars found matching the criteria.</p>
      </div>
    </main>
    <CarInsertModal
      :showToast="showToast"
      :showModal="showCarModal"
      @close="showCarModal = false"
      @success="fetchCars()"
    />
  </div>
  <div v-else-if="errorMessage" class="error">
    <div>
      {{ errorMessage }}
    </div>
  </div>
  <div v-else class="loader">Loading...</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import CarCard from "./CarCard.vue";
import CarInsertModal from "./CarInsertModal.vue";
import { useRouter } from "vue-router";
import Multiselect from "vue-multiselect";

const router = useRouter();
const cars = ref(null);
let isLoading = ref(true);
let errorMessage = ref(null);
let showCarModal = ref(false);
const emit = defineEmits(["openLoginModal", "isLoggedIn"]);
const props = defineProps({
  isLoggedIn: Boolean,
  showToast: Function,
});

watch(
  () => props.isLoggedIn,
  value => (value ? fetchCars() : null)
);

const addTag = newTag => {
  this.filters.selectedFeatures.push(newTag);
};

const fuelTypeOptions = computed(() => {
  const uniqueFuelTypes = [...new Set(cars.value.map(car => car.fuelType))];
  return ["All", ...uniqueFuelTypes].filter(type => type !== filters.value.selectedFuelType);
});

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

const filters = ref({
  make: "All",
  minYear: "",
  maxMileage: "",
  maxPrice: "",
  selectedFeatures: [],
  selectedFuelType: "All",
});

const uniqueMakes = computed(() => {
  const allTypes = [...new Set(cars.value.map(car => car.make))];
  return ["All", ...allTypes].filter(make => make !== filters.value.make);
});

const filteredCars = computed(() => {
  return cars.value.filter(car => {
    const matchMake = filters.value.make
      ? car.make === filters.value.make || filters.value.make === "All"
      : true;
    const matchYear = filters.value.minYear ? car.year >= filters.value.minYear : true;
    const matchMileage = filters.value.maxMileage ? car.mileage <= filters.value.maxMileage : true;
    const matchPrice = filters.value.maxPrice ? car.price <= filters.value.maxPrice : true;
    const matchFeatures = filters.value.selectedFeatures.length
      ? filters.value.selectedFeatures.every(feature => car.features.includes(feature.name))
      : true;
    const matchFuelType = filters.value.selectedFuelType
      ? car.fuelType === filters.value.selectedFuelType || filters.value.selectedFuelType === "All"
      : true;
    return matchMake && matchYear && matchMileage && matchPrice && matchFeatures && matchFuelType;
  });
});

const resetFilters = () => {
  filters.value = {
    make: "All",
    minYear: "",
    maxMileage: "",
    maxPrice: "",
    selectedFeatures: [],
    selectedFuelType: "All",
  };
};
</script>

<style scoped lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: 263px 1fr;
  padding: 30px;
  background-color: aliceblue;
  // background: radial-gradient(aliceblue, #2377cc);
  background: linear-gradient(to top, #2377cc, aliceblue);
  // background: linear-gradient(to bottom right, aliceblue, rgba(255, 0, 0, 0));

  color: black;
  min-height: 100vh;
  overflow: hidden;
}

.filters {
  min-width: 263px;
  transition: transform 0.3s ease;
  /* border-right: 2px solid #ccc; */
  padding-right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative; /* Enable positioning for the pseudo-element */
  padding-right: 20px; /* Add some space so the content doesn't overlap the gradient */
  .form-group {
    padding-top: 10px;
    input {
      height: 40px;
      width: 100%;
      border: none;
      outline: none;
      border-radius: 5px;
      padding: 0 10px;
    }
    .form-label {
      display: block;
    }
  }
  .reset-button {
    background-color: #2377cc;
    color: white;
    border: none;
    height: 40px;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
    font-size: 16px;
    font-family: "Fira Sans";
  }
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
  background: linear-gradient(to bottom, transparent 0%, #fff 50%, transparent 100%);
  pointer-events: none; /* Allow clicks through the pseudo-element */
}

.car-list {
  flex: 1;
  display: flex;

  flex-direction: column;
  gap: 1rem;
  .header-container {
    display: flex;
    justify-content: space-between;
    padding: 0rem 2rem;
  }
  .car-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1.5rem;
    padding: 2rem;
    width: 100%;
    margin: 0 auto; /* Center the grid */
    box-sizing: border-box;
    padding-right: 0rem;
  }
  .header-text {
    display: inline-block;
  }
  .add-car {
    align-self: end;
    justify-self: end;
    width: fit-content;
    padding: 10px 20px;
    height: 40px;
    background-color: #2377cc;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-family: "Fira Sans";
    border-radius: 5px;
  }
}
@media (max-width: 1440px) {
  .car-grid {
    grid-template-columns: 1fr 1fr 1fr !important;
  }
}

@media (max-width: 1078px) {
  .dashboard {
    grid-template-columns: 1fr 4fr;
  }
  .car-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 923px) {
  .dashboard {
    grid-template-columns: 1fr 3fr;
  }
  .filters {
    min-width: unset;
    // width: 100%;
  }
  .car-grid {
    grid-template-columns: 1fr 1fr !important;
  }
}

@media (max-width: 728px) {
  .dashboard {
    grid-template-columns: 1fr 2fr;
  }
  .car-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
