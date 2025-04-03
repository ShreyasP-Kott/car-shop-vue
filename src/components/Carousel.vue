<template>
  <div class="slider">
    <div class="slider-inner">
      <div class="slide" data-slide="1">
        <div
          class="content"
          style="
            background-image: url('https://images.ctfassets.net/6jp6wwxb6y1v/34yA76KX4fOBHlgA8mgGdl/0c66adf81b941e1a6147f581b3a395e5/IAA_-_Fleet_Inventory_on_IAA_Timed_Auctions_-_Nov_2024_-_Carousel_Banner_Graphic.jpg');
          "
        ></div>
      </div>

      <div class="slide" data-slide="2">
        <div
          class="content"
          style="
            background-image: url('https://wallpapercave.com/wp/wp3720759.jpg');
          "
        ></div>
      </div>

      <div class="slide" data-slide="3">
        <div
          class="content"
          style="
            background-image: url('https://www.adesa.com/wp-content/uploads/2023/07/iStock-1285180944-4.png');
          "
        ></div>
      </div>

      <div class="slide" data-slide="4">
        <div
          class="content"
          style="
            background-image: url('https://wallpapercave.com/wp/wp8825440.jpg');
          "
        ></div>
      </div>
    </div>

    <div class="indicators">
      <div class="indicator" data-slide="1" active></div>
      <div class="indicator" data-slide="2"></div>
      <div class="indicator" data-slide="3"></div>
      <div class="indicator" data-slide="4"></div>
    </div>

    <div class="arrows">
      <div class="arrow-prev">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="arrow-next">
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
let indicators = ref(null);
let arrowPrev = ref(null);
let arrowNext = ref(null);

onMounted(() => {
  indicators.value = Array.from(
    document.querySelectorAll(".slider .indicators .indicator")
  );
  arrowPrev.value = document.querySelector(".slider .arrows .arrow-prev");
  arrowNext.value = document.querySelector(".slider .arrows .arrow-next");

  indicators.value.forEach((indicator) => {
    indicator.addEventListener("click", handleIndicatorClick);
  });

  arrowPrev.value.addEventListener("click", handlePrevArrowClick);
  arrowNext.value.addEventListener("click", handleNextArrowClick);
});

const handleIndicatorClick = (event) => {
  const indicator = event.target;
  if (!isActive(indicator)) {
    removeActive();
    addActive(indicator);
    showSlide(indicator.dataset.slide);
  }
};

const handlePrevArrowClick = (event) => {
  let activeSlide = 0;
  let newActiveSlide = indicators.value.length;
  let ready = false;

  indicators.value.forEach((indicator) => {
    if (isActive(indicator) && !ready) {
      activeSlide = indicator.dataset.slide;
      if (activeSlide !== "1") {
        newActiveSlide = parseInt(activeSlide) - 1;
      }
      removeActive();
      addActive(
        document.querySelector(
          `.slider .indicators [data-slide='${newActiveSlide}']`
        )
      );
      showSlide(newActiveSlide);
      ready = true;
    }
  });
};

const handleNextArrowClick = (event) => {
  let activeSlide = 0;
  let newActiveSlide = 1;
  let ready = false;

  indicators.value.forEach((indicator) => {
    if (isActive(indicator) && !ready) {
      activeSlide = indicator.dataset.slide;
      if (activeSlide !== indicators.value.length.toString()) {
        newActiveSlide = parseInt(activeSlide) + 1;
      }
      removeActive();
      addActive(
        document.querySelector(
          `.slider .indicators [data-slide='${newActiveSlide}']`
        )
      );
      showSlide(newActiveSlide);
      ready = true;
    }
  });
};

function isActive(indicator) {
  return indicator.hasAttribute("active");
}

function removeActive() {
  document.querySelectorAll(".slider .indicators [active]").forEach((item) => {
    item.removeAttribute("active");
  });
}

function addActive(indicator) {
  indicator.setAttribute("active", "");
}

function showSlide(newActiveSlide) {
  const newPosition = (100 * (newActiveSlide - 1)).toString();
  document.querySelector(".slider-inner").style.marginLeft = `-${newPosition}%`;
}
</script>
