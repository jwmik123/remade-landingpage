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

const typewriterID = document.getElementById("typewriter");
const typewriter = new Typewriter(typewriterID, {
  loop: true,
  delay: 250,
});

typewriter
  .typeString("REMAKING")
  .pauseFor(1500)
  .deleteChars(6)
  .typeString("VIVING")
  .pauseFor(1500)
  .deleteChars(6)
  .typeString("MADE")
  .pauseFor(3500)
  .deleteChars(4)
  .start();

/**
 * GSAP ANIMATIONS
 */
const tl = gsap.timeline();
const border = document.querySelector(".border-t");

gsap.set(border, { width: 0 });
gsap.set("nav", { yPercent: -70 });
gsap.set(".h1-title", { yPercent: 100 });

tl.to(border, {
  scrollTrigger: ".header",
  width: "100%",
  duration: 1.5,
  ease: "power2.out",
});
tl.to(".h1-title", {
  scrollTrigger: ".header",
  opacity: 1,
  yPercent: 0,
  stagger: 0.1,
  duration: 1,
});

tl.to(".small-text", {
  scrollTrigger: ".header",
  opacity: 1,
  duration: 1,
});

gsap.to("nav", {
  scrollTrigger: ".header",
  yPercent: 0,
  delay: 1,
  duration: 1,
});

gsap.to(".phrases", {
  scrollTrigger: "#services",
  opacity: 1,
  duration: 1.5,
});
