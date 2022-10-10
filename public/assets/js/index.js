window.addEventListener("DOMContentLoaded", () => {
  console.log(" dom loaded");
  let i = 0;
  const txt =
    "Scorchers Cricket: Nurturing the next generation of cricket stars."; /* The text */
  const speed = 100; /* The speed/duration of the effect in milliseconds */
const nurt=document.getElementById("nurturing")
 
  //typeWriter();
  async function typeWriter(element,text){
    const timer = (ms) => new Promise((res) => setTimeout(res, ms))
    
    console.log(element,text)
    for (let index = 0; index <text.length; index++) {
      const letter =text.charAt(index);
      element.innerHTML+=letter
      console.log(letter)
     await timer(100)
     // setTimeout(element.innerHTML+=letter,5000)
      
    }

  }
  typeWriter(nurt,txt)
});
