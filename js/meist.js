const burger = document.querySelector(".burger");
const links = document.querySelector(".links");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("show");
});

const swiper = new Swiper(".swiper", {
  direction: "horizontal",
  slidesPerView: 1,
  spaceBetween: 0,
  mousewheel: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  on: {
    slideChange: function () {
      // parallax efekt
      document.querySelectorAll(".slide-bg").forEach((bg, index) => {
        const offset = (index - this.activeIndex) * 30; // liikumise kiirus
        bg.style.transform = `translateY(${offset}px)`;
      });
    },
  },
});
