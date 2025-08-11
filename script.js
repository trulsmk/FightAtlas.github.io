const sportData = {
  mma: {
    title: "UFC 305",
    details: "24. august 2025 – T-Mobile Arena, Las Vegas, USA",
    fighters: [
      { name: "Fighter A", record: "20-3", country: "USA" },
      { name: "Fighter B", record: "18-2", country: "BRA" }
    ]
  },
  boxing: {
    title: "World Title Night",
    details: "14. september 2025 – Madison Square Garden, NYC, USA",
    fighters: [
      { name: "Boxer A", record: "30-1", country: "UK" },
      { name: "Boxer B", record: "28-0", country: "MEX" }
    ]
  }
  // legg til resten av sportene
};

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("event-title");
const modalDetails = document.getElementById("event-details");
const modalFighters = document.getElementById("fighters");
const closeBtn = document.querySelector(".close");

document.querySelectorAll(".sport-card").forEach(card => {
  card.addEventListener("click", () => {
    const sport = card.dataset.sport;
    const event = sportData[sport];
    modalTitle.textContent = event.title;
    modalDetails.textContent = event.details;
    modalFighters.innerHTML = event.fighters
      .map(f => `<p>${f.name} (${f.country}) – ${f.record}</p>`)
      .join("");
    modal.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
