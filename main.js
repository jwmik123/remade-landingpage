import Lenis from "@studio-freight/lenis";
// import ScrollyVideo from "scrolly-video";
import Typewriter from "typewriter-effect/dist/core";
import gsap from "gsap";

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

// const container = document.getElementById("phrases");
// const phrases = container.getElementsByTagName("p");

// for (let i = 0; i < phrases.length; i++) {
//   window.addEventListener("scroll", function () {
//     const middleOfScreen = window.innerHeight / 1.2;
//     const middleOfPhrase =
//       phrases[i].getBoundingClientRect().top + phrases[i].offsetHeight / 2;

//     if (middleOfPhrase >= middleOfScreen) {
//       phrases[i].style.opacity = 0;
//       phrases[i].style.top = -1 + "rem";
//     } else {
//       phrases[i].style.opacity = 1;
//       phrases[i].style.top = 0;
//     }
//   });
// }

const typewriterID = document.getElementById("typewriter");
const typewriter = new Typewriter(typewriterID, {
  loop: true,
  delay: 150,
});

//Easter eggie, call me Maggy

typewriter
  .typeString("Remaking")
  .pauseFor(1500)
  .deleteChars(8)
  .typeString("Reviving")
  .pauseFor(1500)
  .deleteChars(8)
  .typeString("Remade")
  .pauseFor(3500)
  .deleteChars(6)
  .start();

const tl = gsap.timeline();
const border = document.querySelector(".border-t");

gsap.set(border, { width: 0 });
gsap.set("nav", { yPercent: -70 });

tl.to(border, {
  scrollTrigger: ".header",
  width: "100%",
  duration: 1.5,
  ease: "power2.out",
});
tl.to(".title", {
  scrollTrigger: ".header",
  opacity: 1,
  duration: 1,
});

tl.to(".small-text", {
  scrollTrigger: ".header",
  opacity: 1,
  duration: 1,
});

tl.to("nav", {
  scrollTrigger: ".header",
  // delay: 2,
  yPercent: 0,
  duration: 1,
});

gsap.to(".phrases", {
  scrollTrigger: ".phrases",
  opacity: 1,
  duration: 1.5,
});
