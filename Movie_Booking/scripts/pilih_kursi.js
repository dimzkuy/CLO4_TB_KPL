// Constants - dapat digunakan kembali di file lain
const THEATER_CONFIG = {
  ROWS: 6,
  SEATS_PER_ROW: 8
};

const STORAGE_KEYS = {
  SELECTED_FILM: "filmDipilih",
  SELECTED_DATE: "selectedDate",
  SELECTED_SHOWTIME: "selectedShowTime",
  SELECTED_SEATS: "selectedSeats",
  SELECTED_FILM_IMAGE: "selectedFilmImage"
};

const CSS_CLASSES = {
  SEAT_ROW: "seat-row",
  SEAT: "seat",
  SELECTED: "selected",
  OCCUPIED: "occupied"
};

const FILM_IMAGES = {
  Inception: "../img/Inception.jpeg",
  Interstellar: "../img/Interstelar.jpeg",
  "The Dark Knight": "../img/The_Dark_Knight.jpeg",
  "The Shawshank Redemption": "../img/The_Shawshank_Redemption.jpeg",
  "The Theory of Everything": "../img/The_Theory_of_Everything.jpeg",
  "Toy Story 4": "../img/Toy_Story.jpeg",
};

// Utility Functions - dapat digunakan kembali
function getFromLocalStorage(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
}

function createBookingKey(film, date, time) {
  return `seats_${film}_${date}_${time}`;
}

function generateSeatId(rowIndex, seatIndex) {
  return String.fromCharCode(65 + rowIndex) + (seatIndex + 1);
}

function createElement(tag, className, textContent = '', attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (textContent) element.textContent = textContent;
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  return element;
}

function getSelectedSeats() {
  return Array.from(document.querySelectorAll(".seat.selected"))
    .map((seat) => seat.dataset.kursi);
}

function validateSeatSelection(seats) {
  if (seats.length === 0) {
    alert("Silakan pilih minimal satu kursi!");
    return false;
  }
  return true;
}

// DOM Elements
const seatContainer = document.getElementById("seat-container");
const submitBtn = document.getElementById("submit");

// Get booking data - menggunakan reusable functions
const film = localStorage.getItem(STORAGE_KEYS.SELECTED_FILM) || "Film";
const tanggal = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || new Date().toISOString().split('T')[0];
const jam = localStorage.getItem(STORAGE_KEYS.SELECTED_SHOWTIME) || "19:00";

const bookingKey = createBookingKey(film, tanggal, jam);
console.log("Booking key:", bookingKey);

const occupiedSeats = getFromLocalStorage(bookingKey, []);
const filmImage = FILM_IMAGES[film] || "";

// Set page title
document.getElementById("judulFilm").innerText = `Pilih Kursi Untuk "${film}" - ${jam} (${tanggal})`;

// Seat creation - menggunakan reusable functions
function createSeatElement(seatId, isOccupied) {
  const seat = createElement('div', CSS_CLASSES.SEAT, seatId, {
    'data-kursi': seatId
  });

  if (isOccupied) {
    seat.classList.add(CSS_CLASSES.OCCUPIED);
  }

  seat.addEventListener("click", () => {
    if (!seat.classList.contains(CSS_CLASSES.OCCUPIED)) {
      seat.classList.toggle(CSS_CLASSES.SELECTED);
    }
  });

  return seat;
}

function createSeatRow(rowIndex) {
  const rowDiv = createElement('div', CSS_CLASSES.SEAT_ROW);

  for (let j = 0; j < THEATER_CONFIG.SEATS_PER_ROW; j++) {
    const seatId = generateSeatId(rowIndex, j);
    const isOccupied = occupiedSeats.includes(seatId);
    const seat = createSeatElement(seatId, isOccupied);
    rowDiv.appendChild(seat);
  }

  return rowDiv;
}

// Build theater seating
function buildTheaterSeating() {
  for (let i = 0; i < THEATER_CONFIG.ROWS; i++) {
    const rowDiv = createSeatRow(i);
    seatContainer.appendChild(rowDiv);
  }
}

// Handle seat booking
function handleSeatBooking() {
  const selectedSeats = getSelectedSeats();
  
  if (!validateSeatSelection(selectedSeats)) {
    return;
  }

  // Update occupied seats
  const updatedOccupied = [...new Set([...occupiedSeats, ...selectedSeats])];
  saveToLocalStorage(bookingKey, updatedOccupied);

  // Save booking data
  saveToLocalStorage(STORAGE_KEYS.SELECTED_SEATS, selectedSeats);
  saveToLocalStorage(STORAGE_KEYS.SELECTED_FILM, film);
  saveToLocalStorage(STORAGE_KEYS.SELECTED_FILM_IMAGE, filmImage);

  console.log("Seats saved for:", bookingKey, selectedSeats);
  window.location.href = "payment.html";
}

// Initialize
buildTheaterSeating();
submitBtn.addEventListener("click", handleSeatBooking);