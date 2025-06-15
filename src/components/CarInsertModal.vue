<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <h2>Add Car Details</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Make*</label>
          <input v-model="form.make" required />
        </div>

        <div class="form-group">
          <label>Model*</label>
          <input v-model="form.model" required />
        </div>

        <div class="form-group">
          <label>Year*</label>
          <input
            type="text"
            v-model.number="form.year"
            :min="1886"
            :max="new Date().getFullYear()"
            required
          />
        </div>

        <div class="form-group">
          <label>Price (USD)*</label>
          <input type="number" v-model.number="form.price" min="0" required />
        </div>

        <div class="form-group">
          <label>Fuel Type*</label>
          <select v-model="form.fuelType" required>
            <option value="" disabled>Select</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </div>

        <div class="form-group">
          <label>Mileage (km)*</label>
          <input type="number" v-model.number="form.mileage" min="0" required />
        </div>

        <div class="form-group">
          <label>Color*</label>
          <input v-model="form.color" required />
        </div>

        <div class="form-group">
          <label>Features</label>
          <div v-for="(feature, index) in form.features" :key="index" class="features">
            <input v-model="form.features[index]" />
            <button class="btn" type="button" @click="removeFeature(index)">Remove</button>
          </div>
          <button class="btn" type="button" @click="addFeature">Add Feature</button>
        </div>

        <div class="form-group">
          <label>Image URL*</label>
          <input v-model="form.image" required pattern="https?://.+" />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" @click="resetForm">Reset</button>
          <button type="submit" class="btn">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps } from "vue";

const props = defineProps({
  showModal: Boolean,
  showToast: Function,
});

const emit = defineEmits(["close", "success"]);

const form = reactive({
  make: "",
  model: "",
  year: null,
  price: null,
  fuelType: "",
  mileage: null,
  color: "",
  features: [""],
  image: "",
});

const resetForm = () => {
  form.make = "";
  form.model = "";
  form.year = null;
  form.price = null;
  form.fuelType = "";
  form.mileage = null;
  form.color = "";
  form.features = [""];
  form.image = "";
};

const addFeature = () => {
  form.features.push("");
};

const removeFeature = index => {
  form.features.splice(index, 1);
};

const handleSubmit = async () => {
  const carData = { ...form };
  try {
    const response = await fetch("https://localhost:7154/api/cars/addCar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ← token from login response or localStorage
      },
      body: JSON.stringify(carData),
    });

    if (!response.ok) {
      throw new Error("An error is encountered. Please login again...");
    } else {
      const data = await response.json();
      props.showToast(data.message, "success");
      emit("success");
    }
  } catch (error) {
    console.error(error);
  }
  emit("close");
  resetForm();
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.close-btn {
  position: absolute;
  right: 24px;
  top: 24px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
.form-group {
  margin: 1rem 0;
}
.form-group label {
  display: block;
  margin-bottom: 0.25rem;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.features {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  background: dodgerblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Fira Sans";
}
.btn:hover {
  background: #0056b3;
}
</style>
