<!-- components/CarCard.vue -->
<template>
  <div class="card">
    <h4>{{ car.model }}</h4>
    <p>Year: {{ car.year }}</p>
    <p>Mileage: {{ car.mileage }} km</p>
  </div>
</template>

<script setup>
defineProps({
  car: Object,
});
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
}
</style>
