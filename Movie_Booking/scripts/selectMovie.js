// sections/selectMovie.js

document.addEventListener("DOMContentLoaded", function () {
  // Ambil semua elemen movie-card
  const movieCards = document.querySelectorAll(".movie-card");

  movieCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Ambil judul film dari elemen .movie-title di dalam card
      const title = card.querySelector(".movie-title").textContent;

      // Simpan ke localStorage
      localStorage.setItem("filmDipilih", title);

      // Redirect ke halaman pilih kursi
      window.location.href = "pilih_kursi.html";
    });
  });
});
