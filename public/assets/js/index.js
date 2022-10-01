window.addEventListener("DOMContentLoaded", () => {
  console.log(" dom loaded");
  let i = 0;
  const txt =
    "Nurturing the next generation of cricket stars. join Today"; /* The text */
  const speed = 100; /* The speed/duration of the effect in milliseconds */

  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("nurturing").innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
});
