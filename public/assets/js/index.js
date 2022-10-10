window.addEventListener("DOMContentLoaded", () => {
  console.log(" dom loaded");
  let i = 0;
  const txt =
    "Scorchers Cricket: Nurturing the next generation of cricket stars."; /* The text */
  const speed = 100; /* The speed/duration of the effect in milliseconds */
  const nurturing = document.getElementById("nurturing");
  const regHeader = document.getElementById("regHeader");

  //typeWriter();
  async function typeWriter(element, text) {
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let index = 0; index < text.length; index++) {
      const letter = text.charAt(index);
      element.innerHTML += letter;

      await timer(100);
      // setTimeout(element.innerHTML+=letter,5000)
    }
  }
  typeWriter(nurturing, txt);
  typeWriter(regHeader, txt);

  const form = document.getElementById("myForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    sendFormData();
    console.log("submitted");
  });

  async function sendFormData() {
    const formData = new FormData(form);
    const options = {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      body: formData,
    };
    const response = await fetch("/registration", options);
    console.log(response.json());
  }
});
