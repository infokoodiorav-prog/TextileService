const burger = document.querySelector(".burger");
const links = document.querySelector(".links");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("show");
});
