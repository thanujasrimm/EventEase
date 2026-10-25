
const filterButtons = document.querySelectorAll(".filter");
const eventCards = document.querySelectorAll(".event-card");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const eventCount = document.getElementById("eventCount");
const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("bookingModal");
const modalEventName = document.getElementById("modalEventName");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");
const confirmDemo = document.getElementById("confirmDemo");
const demoMessage = document.getElementById("demoMessage");

let selectedEvent = "";
let selectedPrice = 0;
let activeCategory = "All";

// Filter and search events together
function filterEvents() {
  const searchText = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  eventCards.forEach(function (card) {
    const category = card.dataset.category;
    const eventName = card.querySelector("h3").textContent.toLowerCase();
    const description =
      card.querySelector(".card-description").textContent.toLowerCase();
    const location =
      card.querySelector(".event-location").textContent.toLowerCase();

    const matchesCategory =
      activeCategory === "All" || category === activeCategory;

    const matchesSearch =
      eventName.includes(searchText) ||
      description.includes(searchText) ||
      location.includes(searchText);

    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  eventCount.textContent =
    String(visibleCount).padStart(2, "0") + " EVENTS";

  emptyMessage.hidden = visibleCount !== 0;
}

// Category filter buttons
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    activeCategory = button.dataset.category;

    filterButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    filterEvents();
  });
});

// Search while typing
searchInput.addEventListener("input", filterEvents);

// Search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  filterEvents();
  document.getElementById("eventGrid").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Favourite buttons
document.querySelectorAll(".heart-button").forEach(function (button) {
  button.addEventListener("click", function () {
    const isSaved = button.classList.toggle("saved");

    button.textContent = isSaved ? "♥" : "♡";
    button.setAttribute(
      "aria-pressed",
      String(isSaved)
    );
  });
});

// Open booking popup
document.querySelectorAll(".book-button").forEach(function (button) {
  button.addEventListener("click", function () {
    selectedEvent = button.dataset.event;
    selectedPrice = Number(button.dataset.price);

    modalEventName.textContent = selectedEvent;
    modalPrice.textContent = "₹" + selectedPrice;
    demoMessage.textContent = "";

    confirmDemo.disabled = false;
    confirmDemo.style.opacity = "1";
    confirmDemo.innerHTML = 'Continue <span>→</span>';

    modal.hidden = false;
    closeModal.focus();
  });
});

// Close popup
function hideModal() {
  modal.hidden = true;
}

closeModal.addEventListener("click", hideModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    hideModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !modal.hidden) {
    hideModal();
  }
});

// Demo confirmation only — not a real reservation
confirmDemo.addEventListener("click", function () {
  demoMessage.textContent =
    "You've selected " + selectedEvent +
    " at ₹" + selectedPrice +
    ". Real ticket reservation and payment will be added in the next stage.";

  confirmDemo.disabled = true;
  confirmDemo.style.opacity = "0.6";
});

// Set the initial event count
filterEvents();
