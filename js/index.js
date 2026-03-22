//DOM
document.addEventListener("DOMContentLoaded", () => {
  //BURGER MENU
  const burger = document.querySelector(".burger");
  const links = document.querySelector(".links");

  if (burger && links) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      links.classList.toggle("show");
    });
  }

  //KARUSELL
  const track = document.querySelector(".karusell-track");
  const slides = document.querySelectorAll(".slide");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const container = document.querySelector(".karusell-container");

  if (track && slides.length) {
    let index = 0;
    let autoSlide;

    function updateSlide() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    if (next) {
      next.addEventListener("click", () => {
        index = (index + 1) % slides.length;
        updateSlide();
      });
    }

    if (prev) {
      prev.addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlide();
      });
    }

    function startAutoSlide() {
      autoSlide = setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlide();
      }, 10000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlide);
    }

    if (container) {
      container.addEventListener("mouseenter", stopAutoSlide);
      container.addEventListener("mouseleave", startAutoSlide);
    }

    startAutoSlide();
  }

  //POP-UP
  const openButtons = document.querySelectorAll("#openForm, #avatöövorm");
  const popup = document.getElementById("popupForm");

  if (popup) {
    const closeBtn = popup.querySelector(".close-popup");

    function openPopup() {
      popup.style.display = "flex";
      setTimeout(() => popup.classList.add("show"), 10);
    }

    function closePopup() {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.style.display = "none";
      }, 300);
    }

    openButtons.forEach((btn) => {
      btn.addEventListener("click", openPopup);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closePopup);
    }

    window.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Pakkumise päring saadetud!");
        closePopup();
      });
    }
  }
});
