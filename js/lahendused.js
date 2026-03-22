const burger = document.querySelector(".burger");
const links = document.querySelector(".links");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("show");
});

const popupButtons = document.querySelectorAll("button[data-popup]");

popupButtons.forEach((btn) => {
  const popupId = btn.getAttribute("data-popup");
  const popup = document.getElementById(popupId);

  btn.addEventListener("click", () => {
    popup.style.display = "flex";
    setTimeout(() => {
      popup.classList.add("show");
    }, 10);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btns = document.querySelectorAll(".varvivalik-btn");
  const popups = document.querySelectorAll(".varvivalik-popup");

  btns.forEach((btn, i) => {
    const popup = popups[i];
    const popupContent = popup.querySelector(".popup-content");
    const closeBtn = popup.querySelector(".close-popup");
    const popupImg = popup.querySelector(".popup-img");
    const arrows = popup.querySelectorAll(".nool");

    const images = btn.dataset.images.split(",");

    let index = 0;
    let startX = 0;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.style.display = "flex";
      popupImg.src = images[index];
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      popup.style.display = "none";
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.style.display = "none";
      popup.style.display = "none";
    });

    arrows.forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        e.stopPropagation();
        index = arrow.classList.contains("vasak")
          ? (index - 1 + images.length) % images.length
          : (index + 1) % images.length;
        popupImg.src = images[index];
      });
    });

    popupContent.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    popupContent.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;
      let diff = endX - startX;

      if (Math.abs(diff) > 30) {
        index =
          diff > 0
            ? (index - 1 + images.length) % images.length
            : (index + 1) % images.length;

        popupImg.src = images[index];
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sticky-btn");
  const popup = document.getElementById("sticky-popup");
  const close = popup.querySelector(".close-popup");
  const cta = document.getElementById("cta");
  const ctaWc = document.getElementById("cta-wc");
  const ctaRiie = document.getElementById("cta-riided");
  const ctaMopid = document.getElementById("cta-mopid");

  btn.addEventListener("click", () => {
    popup.style.display = "flex";
  });
  cta.addEventListener("click", () => {
    popup.style.display = "flex";
  });
  ctaWc.addEventListener("click", () => {
    popup.style.display = "flex";
  });
  ctaRiie.addEventListener("click", () => {
    popup.style.display = "flex";
  });
  ctaMopid.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  close.addEventListener("click", () => {
    popup.style.display = "none";
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});
