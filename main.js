import Lenis from "@studio-freight/lenis";
// import ScrollyVideo from "scrolly-video";
import { register } from "swiper/element/bundle";
import Typewriter from "typewriter-effect/dist/core";

register();

const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical", // vertical, horizontal
  gestureDirection: "vertical", // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const container = document.getElementById("phrases");
const phrases = container.getElementsByTagName("p");

for (let i = 0; i < phrases.length; i++) {
  window.addEventListener("scroll", function () {
    const middleOfScreen = window.innerHeight / 1.6;
    const middleOfPhrase =
      phrases[i].getBoundingClientRect().top + phrases[i].offsetHeight / 2;

    if (middleOfPhrase >= middleOfScreen) {
      phrases[i].style.opacity = 0;
      phrases[i].style.top = -1 + "rem";
    } else {
      phrases[i].style.opacity = 1;
      phrases[i].style.top = 0;
    }
  });
}

const typewriterID = document.getElementById("typewriter");
const typewriter = new Typewriter(typewriterID, {
  loop: true,
  delay: 150,
});

typewriter
  .typeString("Remaking")
  .pauseFor(1500)
  .deleteChars(8)
  .typeString("Redesigning")
  .pauseFor(1500)
  .deleteChars(11)
  .typeString("Reviving")
  .pauseFor(1500)
  .deleteChars(8)
  .typeString("Remade")
  .pauseFor(3500)
  .deleteChars(6)
  .start();
