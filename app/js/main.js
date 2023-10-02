$(function () {
  // FOOTER ACCORDION
  $(".faq__item-top").on("click", function () {
    $(this).next().slideToggle();
    $(this).toggleClass("open");
  });
});

const values = [
  {
    price: 19.99,
    title: "Standard Edition PS5",
  },
  {
    price: 18.99,
    title: "Standard Edition PS4",
  },
  {
    price: 29.99,
    title: "Deluxe Edition",
  },
  {
    price: 35.99,
    title: "Standard Edition with DualSense",
  },
];

const body = document.querySelector("body");
const header = document.querySelector(".header");
const burger = document.querySelector(".burger");
const menuList = document.querySelector(".menu__list");
const menuLink = document.querySelectorAll(".menu__link");
const video = document.getElementById("video");
const videoButton = document.querySelector(".about__btn");
const systemReqCheck = document.querySelector("#systemReqCheck");
const ragnarokCheck = document.querySelector("#ragnarokCheck");
const switcher = document.querySelectorAll(".explore__switch-text");
const buyButton = document.querySelectorAll(".buy-button");
const modalTitle = document.querySelector(".modal__edition");
const modalPrice = document.querySelector(".modal__price");
const modalCard = document.getElementById("card");
const modalExpire = document.getElementById("expire");
const sections = document.querySelectorAll(".section");

// BURGER MENU
// FIXED HEADER
const toggleMenu = function () {
  burger.classList.toggle("burger--active");
  menuList.classList.toggle("menu__list--active");

  if (window.innerWidth < 1200) {
    body.classList.toggle("lock");
  }
};

const scrollToSection = (e) => {
  e.preventDefault();
  const href = e.currentTarget.getAttribute("href");

  if (!href && !href.startsWith("#")) return;

  const section = href.slice(1);
  const top = document.getElementById(section)?.offsetTop - 100 || 0;
  window.scrollTo({ top, behavior: "smooth" });
};

const fixedHeader = function () {
  window.scrollY > 0
    ? header.classList.add("scrolled")
    : header.classList.remove("scrolled");
};

// TIMMER
const formatValue = (value) => (value < 10 ? `0${value}` : value);

const getTimerValues = (diff) => ({
  seconds: (diff / 1000) % 60,
  minutes: (diff / (1000 * 60)) % 60,
  hours: (diff / (1000 * 3600)) % 24,
  days: diff / (1000 * 3600 * 24),
});

const setTimerValues = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const timerValue = document.getElementById(key);
    timerValue.innerText = formatValue(Math.floor(value));
  });
};

const startTimer = (date) => {
  const id = setInterval(() => {
    const diff = new Date(date).getTime() - new Date().getTime();

    if (diff < 0) {
      clearInterval(id);
      return;
    }

    setTimerValues(getTimerValues(diff));
  }, 1000);
};
startTimer("2024-11-25");

// VIDEO PLAY
let isPlay = false;
const playVideo = function () {
  const info = document.querySelector(".about__text");
  isPlay = !isPlay;

  if (isPlay) {
    videoButton.innerText = "Pause";
    info.classList.add("hidden");
    video.play();
  } else {
    info.classList.remove("hidden");
    videoButton.innerText = "Play";
    video.pause();
  }
};

// CHECKBOX LOGIC
const systemReq = function () {
  const elements = document.querySelectorAll(".system-req");
  elements.forEach((element) => element.classList.toggle("current"));
};

const handleCheck = function () {
  const price = document.querySelector(".explore__content-price");
  const elements = document.querySelectorAll(".ragnarok");

  ragnarokCheck.checked
    ? (price.innerHTML = "25.99$")
    : (price.innerHTML = "15.99$");
  elements.forEach((element) => element.classList.toggle("current"));
};

// SLIDER SWIPER
const swiper = new Swiper(".news__swiper", {
  loop: true,
  mousewheel: true,
  spaceBetween: 20,
  keyboard: {
    enabled: true,
  },

  navigation: {
    prevEl: ".news__swiper-prev",
    nextEl: ".news__swiper-next",
  },

  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 2,
    },
    1800: {
      slidesPerView: 3,
    },
  },
});

// MODAL
const scrollController = {
  scrollPosition: 0,
  disabledScroll() {
    scrollController.scrollPosition = window.scrollY;
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      top: -${scrollController.scrollPosition}px;
      left: 0;
      height: 100vh;
      width: 100vw;
      padding-right: ${window.innerWidth - document.body.offsetWidth}px
    `;
    document.documentElement.style.scrollBehavior = "unset";
  },
  enabledScroll() {
    document.body.style.cssText = "";
    window.scroll({ top: scrollController.scrollPosition });
    document.documentElement.style.scrollBehavior = "";
  },
};

const modalController = ({ btnOpen, btnClose = ".modal__close" }) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const modalElem = document.querySelector(".modal");

  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 400ms ease-in-out;
  `;

  const closeModal = (event) => {
    const target = event.target;

    if (
      target === modalElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === "Escape"
    ) {
      modalElem.style.opacity = 0;

      setTimeout(() => {
        modalElem.style.visibility = "hidden";
        scrollController.enabledScroll();
      }, 400);

      window.removeEventListener("keydown", closeModal);
    }
  };

  const openModal = (event) => {
    event.preventDefault();
    modalElem.style.visibility = "visible";
    modalElem.style.opacity = 1;
    window.addEventListener("keydown", closeModal);
    scrollController.disabledScroll();
  };

  buttonElems.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  modalElem.addEventListener("click", closeModal);
};

// BUY BUTTON
const handleBuyButton = ({ currentTarget: target }) => {
  const { value } = target.dataset;

  if (!value) return;

  const { price, title } = values[value];

  modalTitle.innerText = title;
  modalPrice.innerText = `${price}$`;
};

// CARD MASK
const cardMask = function () {
  const len = modalCard.value.length;
  if (len === 4 || len === 9 || len === 14) {
    modalCard.value += " ";
  }
};

// EXPIRE MASK
const expireMask = function () {
  if (modalExpire.value.length === 2) {
    modalExpire.value += "/";
  }
};

// SECTION ANIMATION
const handleScroll = () => {
  const { scrollY: y, innerHeight: h } = window;
  sections.forEach((section) => {
    y > section.offsetTop - h / 1.5
      ? section.classList.remove("hidden")
      : section.classList.add("hidden");
  });
};

window.addEventListener("scroll", handleScroll);
window.addEventListener("scroll", fixedHeader);
burger.addEventListener("click", toggleMenu);
menuLink.forEach((link) => link.addEventListener("click", scrollToSection));
menuLink.forEach((link) => link.addEventListener("click", toggleMenu));
videoButton.addEventListener("click", playVideo);
systemReqCheck.addEventListener("click", systemReq);
ragnarokCheck.addEventListener("click", handleCheck);
modalController({ btnOpen: ".buy-button" });
buyButton.forEach((btn) => btn.addEventListener("click", handleBuyButton));
modalCard.addEventListener("keypress", cardMask);
modalExpire.addEventListener("keypress", expireMask);
