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

// Get date from localStorage and format it
const selectedDate = localStorage.getItem("selectedDate");
if (selectedDate) {
  const date = new Date(selectedDate);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = date.toLocaleDateString('id-ID', options);
  document.getElementById("movieDate").textContent = formattedDate;
}
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TIKET BIOSKOP", 105, 25, { align: "center" });
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Movie details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DETAIL PEMESANAN", 20, 50);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Film:`, 20, 65);
  doc.setFont("helvetica", "bold");
  doc.text(`${film}`, 50, 65);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal:`, 20, 75);
  doc.setFont("helvetica", "bold");
  doc.text(`${document.getElementById("movieDate").textContent}`, 50, 75);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Jam Tayang:`, 20, 85);
  doc.setFont("helvetica", "bold");
  doc.text(`${jamTayang}`, 50, 85);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Kursi:`, 20, 95);
  doc.setFont("helvetica", "bold");
  doc.text(`${kursi.join(", ")}`, 50, 95);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Harga Total:`, 20, 105);
  doc.setFont("helvetica", "bold");
  doc.text(`Rp ${totalHarga.toLocaleString("id-ID")}`, 50, 105);
  
  // Bottom separator
  doc.setLineWidth(0.5);
  doc.line(20, 120, 190, 120);
  
  // Thank you message
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Terima kasih telah memesan tiket! Tunjukkan tiket ini saat masuk bioskop.", 105, 135, { align: "center" });
  
  // Cinema info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("CinemaBook - Your Premium Cinema Experience", 105, 145, { align: "center" });
  
  doc.save("Tiket_Bioskop.pdf");
}

function downloadCSV() {
  const formattedDate = document.getElementById("movieDate").textContent;
  
  // Create CSV content with proper formatting and encoding
  const csvData = [
    // Header row
    "Film,Tanggal,Jam Tayang,Kursi,Harga Total",
    // Data row with proper escaping for commas
    `"${film}","${formattedDate}","${jamTayang}","${kursi.join(" | ")}","Rp ${totalHarga.toLocaleString("id-ID")}"`
  ].join("\n");
  
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = "\uFEFF";
  const csvContent = BOM + csvData;
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Tiket_Bioskop.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
