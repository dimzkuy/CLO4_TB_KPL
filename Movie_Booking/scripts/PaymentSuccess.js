// Ambil data pesanan dari localStorage
const film = localStorage.getItem("selectedFilm") || "Film";
const kursi = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
const jamTayang = localStorage.getItem("selectedShowTime") || "19:00 WIB";
const hargaPerKursi = 45000;
const totalHarga = kursi.length * hargaPerKursi;

document.getElementById("filmTitle").textContent = film;
document.getElementById("showTime").textContent = jamTayang;
document.getElementById("seats").textContent = kursi.join(", ");
document.getElementById("totalPrice").textContent = "Rp " + totalHarga.toLocaleString("id-ID");

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Tiket Bioskop", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Film: ${film}`, 20, 40);
  doc.text(`Jam Tayang: ${jamTayang}`, 20, 50);
  doc.text(`Kursi: ${kursi.join(", ")}`, 20, 60);
  doc.text(`Harga Total: Rp ${totalHarga.toLocaleString("id-ID")}`, 20, 70);
  doc.text("Terima kasih telah memesan tiket!", 20, 90);
  doc.save("Tiket_Bioskop.pdf");
}

function downloadCSV() {
  const rows = [
    ["Film", "Jam Tayang", "Kursi", "Harga Total"],
    [film, jamTayang, kursi.join(" | "), "Rp " + totalHarga.toLocaleString("id-ID")]
  ];
  let csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Tiket_Bioskop.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}