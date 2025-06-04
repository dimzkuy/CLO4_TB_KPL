// Prevent clicking on movie cards and show login prompt
document.addEventListener('DOMContentLoaded', function() {
    console.log('Film landing page loaded');
    
    const movieCards = document.querySelectorAll('.movie-preview');
    
    movieCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if it's a coming soon movie
            const isComingSoon = card.classList.contains('coming-soon');
            
            if (isComingSoon) {
                alert('Film ini akan segera tayang. Silakan tunggu tanggal rilisnya!');
                return;
            }
            
            // Show login prompt for regular movies
            const confirmLogin = confirm('Anda perlu login terlebih dahulu untuk memesan tiket. Ingin login sekarang?');
            if (confirmLogin) {
                window.location.href = 'login.html';
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});