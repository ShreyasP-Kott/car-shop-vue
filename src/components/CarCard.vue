<!-- components/CarCard.vue -->
<template>
  <div class="car-card">
    <img :src="car.image" :alt="`${car.make} ${car.model}`" class="car-image" />
    <div class="car-details">
      <h2 class="car-title">{{ car.year }} {{ car.make }} {{ car.model }}</h2>
      <p class="car-price">${{ car.price.toLocaleString() }}</p>
      <p class="car-meta">
        Fuel: {{ car.fuelType }} | Mileage: {{ car.mileage }} km | Color: {{ car.color }}
      </p>

      <ul class="features-list">
        <li v-for="(feature, index) in car.features" :key="index">✔ {{ feature }}</li>
      </ul>

      <!-- <button class="view-button">View Details</button> -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  car: Object,
});
</script>

<style scoped>
.car-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: transform 0.3s;
}

.car-card:hover {
  transform: translateY(-5px);
}

.car-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.car-details {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.car-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.car-price {
  color: #1e88e5;
  font-weight: bold;
  margin: 0;
}

.car-meta {
  font-size: 0.9rem;
  color: #666;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.85rem;
}

.features-list li {
  margin-bottom: 0.25rem;
}

.view-button {
  padding: 0.6rem;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: auto;
  transition: background-color 0.2s;
}

.view-button:hover {
  background-color: #1565c0;
}
</style>
