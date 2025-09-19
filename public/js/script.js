(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})



// const filters = document.querySelectorAll(".filter");
// const cards = document.querySelectorAll(".listing-card");

// filters.forEach(filter => {
//   filter.addEventListener("click", () => {
//     const category = filter.querySelector("p").innerText;
//     cards.forEach(card => {
//       if(category === "Trending" || card.dataset.category === category){
//         card.parentElement.style.display = "block";
//       } else {
//         card.parentElement.style.display = "none";
//       }
//     });
//   });
// });



const scrollContainer = document.querySelector(".filters-scroll");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

const scrollAmount = 350;

leftBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

// Tax toggle
const taxSwitch = document.getElementById("featuredSwitch");
taxSwitch.addEventListener("change", () => {
    const taxInfoElements = document.getElementsByClassName("tax-info");
    for (let info of taxInfoElements) {
        info.style.display = taxSwitch.checked ? "inline" : "none";
    }
});
