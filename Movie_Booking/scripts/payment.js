// Ambil data pesanan dari localStorage
const film = localStorage.getItem("selectedFilm") || "Film";
const kursi = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
const poster = localStorage.getItem("selectedFilmImage") || "";
const jamTayang = localStorage.getItem("selectedShowTime") || "19:00 WIB"; // default jika belum ada
const hargaPerKursi = 45000;
const totalHarga = kursi.length * hargaPerKursi;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("filmTitle").textContent = film;
  document.getElementById("seats").textContent = kursi.join(", ");
  document.getElementById("filmPoster").src = poster;
  document.getElementById("filmPoster").alt = film;
  document.getElementById("showTime").textContent = jamTayang;
  document.getElementById("totalPrice").textContent =
    "Rp " + totalHarga.toLocaleString("id-ID");
  document.getElementById("amount").value = totalHarga;
});

// Payment methods
const paymentMethods = [
  {
    id: "credit-card",
    icon: '<img src="../img/Credit Card.png" alt="Credit Card" class="w-8 h-8 mb-2">',
    label: "Credit Card",
  },
  {
    id: "paypal",
    icon: '<img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/paypal.svg" alt="PayPal" class="w-8 h-8 mb-2">',
    label: "PayPal",
  },
  {
    id: "mobile-wallet",
    icon: '<img src="../img/Mobile Wallet.png" alt="Mobile Wallet" class="w-8 h-8 mb-2">',
    label: "Mobile Wallet",
  },
  {
    id: "bank-transfer",
    icon: '<img src="../img/Bank Tranfer.png" alt="Bank Transfer" class="w-8 h-8 mb-2">',
    label: "Bank Transfer",
  },
];

let selectedPayment = null;
const container = document.getElementById("paymentOptions");

paymentMethods.forEach((method) => {
  const div = document.createElement("div");
  div.className = "payment-card flex flex-col items-center p-4 cursor-pointer";
  div.innerHTML = `
    ${method.icon}
    <span class="font-medium">${method.label}</span>
  `;
  div.onclick = () => selectPaymentMethod(method.id, div);
  container.appendChild(div);
});

function selectPaymentMethod(id, element) {
  selectedPayment = id;
  document
    .querySelectorAll(".payment-card")
    .forEach((el) => el.classList.remove("active"));
  element.classList.add("active");
}

document.getElementById("payBtn").addEventListener("click", () => {
  const amount = document.getElementById("amount").value;
  if (!selectedPayment) {
    alert("Pilih metode pembayaran terlebih dahulu!");
    return;
  }
  if (!amount || amount <= 0) {
    alert("Masukkan jumlah pembayaran yang valid!");
    return;
  }

  // Strategy Pattern: gunakan strategi berdasarkan ID
  PaymentStrategy.process(selectedPayment, amount, film);
});

// Strategy Pattern untuk pembayaran
const PaymentStrategy = {
  strategies: {
    "credit-card": (amount, film) => {
      alert(
        `Memproses pembayaran Rp${parseInt(amount).toLocaleString(
          "id-ID"
        )} untuk film "${film}" melalui Credit Card`
      );
      window.location.href = "PaymentSuccess.html";
    },
    paypal: (amount, film) => {
      alert(
        `Memproses pembayaran Rp${parseInt(amount).toLocaleString(
          "id-ID"
        )} untuk film "${film}" melalui PayPal`
      );
      window.location.href = "PaymentSuccess.html";
    },
    "mobile-wallet": (amount, film) => {
      alert(
        `Memproses pembayaran Rp${parseInt(amount).toLocaleString(
          "id-ID"
        )} untuk film "${film}" melalui Mobile Wallet`
      );
      window.location.href = "PaymentSuccess.html";
    },
    "bank-transfer": (amount, film) => {
      alert(
        `Memproses pembayaran Rp${parseInt(amount).toLocaleString(
          "id-ID"
        )} untuk film "${film}" melalui Bank Transfer`
      );
      window.location.href = "PaymentSuccess.html";
    },
  },
  process: function (methodId, amount, film) {
    if (this.strategies[methodId]) {
      this.strategies[methodId](amount, film);
    } else {
      alert("Metode pembayaran tidak tersedia.");
    }
  },
};