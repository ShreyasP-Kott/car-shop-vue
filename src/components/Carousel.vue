<script setup>
import { ref, shallowReactive } from "vue";
import {
  VueFlux,
  FluxCaption,
  FluxControls,
  FluxIndex,
  FluxPagination,
  FluxPreloader,
  Img,
  Blinds3D,
} from "vue-flux";
import "vue-flux/style.css";

const $vueFlux = ref();

const vfOptions = shallowReactive({
  autoplay: true,
});

const vfRscs = shallowReactive([
  new Img(
    "https://images.ctfassets.net/6jp6wwxb6y1v/34yA76KX4fOBHlgA8mgGdl/0c66adf81b941e1a6147f581b3a395e5/IAA_-_Fleet_Inventory_on_IAA_Timed_Auctions_-_Nov_2024_-_Carousel_Banner_Graphic.jpg",
    ""
  ),
  new Img("https://wallpapercave.com/wp/wp3720759.jpg", ""),
  new Img("https://www.adesa.com/wp-content/uploads/2023/07/iStock-1285180944-4.png", ""),
  new Img("https://wallpapercave.com/wp/wp8825440.jpg", ""),
]);

const vfTransitions = shallowReactive([Blinds3D]);
</script>

<template>
  <VueFlux :options="vfOptions" :rscs="vfRscs" :transitions="vfTransitions" ref="$vueFlux">
    <template #preloader="preloaderProps">
      <FluxPreloader v-bind="preloaderProps" />
    </template>

    <template #caption="captionProps">
      <FluxCaption v-bind="captionProps" />
    </template>

    <template #controls="controlsProps">
      <FluxControls v-bind="controlsProps" />
    </template>

    <template #pagination="paginationProps">
      <FluxPagination v-bind="paginationProps" />
    </template>

    <template #index="indexProps">
      <FluxIndex v-bind="indexProps" />
    </template>
  </VueFlux>
</template>

<style lang="scss">
.vue-flux,
.flux-image {
  z-index: 0;
  height: 100vh !important ;
}

.flux-index {
  .flux-button > svg {
    display: none !important;
    visibility: hidden !important;
  }
}
</style>
