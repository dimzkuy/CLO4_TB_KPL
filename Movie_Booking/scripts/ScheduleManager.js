class ScheduleManager {
    constructor() {
        this.scheduleData = null;
        this.selectedDate = null;
        this.selectedMovie = localStorage.getItem('filmDipilih');
    }

    // Load schedule data from JSON
    async loadScheduleData() {
        try {
            const response = await fetch('../data/scheduleData.json');
            if (!response.ok) {
                throw new Error('Failed to load schedule data');
            }
            this.scheduleData = await response.json();
            return this.scheduleData;
        } catch (error) {
            console.error('Error loading schedule data:', error);
            // Fallback data in case JSON file is not available
            this.scheduleData = this.getFallbackScheduleData();
            return this.scheduleData;
        }
    }

    // Fallback schedule data
    getFallbackScheduleData() {
        return {
            'Inception': {
                poster: '../img/Inception.jpeg',
                genre: 'Sci-Fi, Adventure',
                duration: '148 menit',
                rating: '4.8',
                showtimes: ['10:00', '13:30', '16:45', '19:30', '22:15']
            },
            'Interstellar': {
                poster: '../img/Interstelar.jpeg',
                genre: 'Adventure, Drama, Sci-Fi',
                duration: '169 menit',
                rating: '4.7',
                showtimes: ['09:30', '13:00', '16:30', '20:00']
            },
            'The Dark Knight': {
                poster: '../img/The_Dark_Knight.jpeg',
                genre: 'Action, Crime, Drama',
                duration: '152 menit',
                rating: '4.9',
                showtimes: ['11:00', '14:30', '18:00', '21:30']
            },
            'The Shawshank Redemption': {
                poster: '../img/The_Shawshank_Redemption.jpeg',
                genre: 'Drama, Crime',
                duration: '142 menit',
                rating: '4.6',
                showtimes: ['10:30', '14:00', '17:30', '21:00']
            }
        };
    }

    // Get movie data by title
    getMovieData(movieTitle) {
        return this.scheduleData ? this.scheduleData[movieTitle] : null;
    }

    // Check if movie is selected
    validateSelectedMovie() {
        if (!this.selectedMovie) {
            alert('Silakan pilih film terlebih dahulu');
            window.location.href = 'home.html';
            return false;
        }
        return true;
    }

    // Show selected movie info
    showSelectedMovieInfo() {
        const movieInfo = this.getMovieData(this.selectedMovie);
        if (movieInfo) {
            const selectedMovieDiv = document.getElementById('selectedMovieInfo');
            selectedMovieDiv.innerHTML = `
                <div class="selected-movie-card">
                    <img src="${movieInfo.poster}" alt="${this.selectedMovie}" class="selected-movie-poster">
                    <div class="selected-movie-details">
                        <h2 class="selected-movie-title">${this.selectedMovie}</h2>
                        <p class="selected-movie-genre">${movieInfo.genre}</p>
                        <div class="selected-movie-meta">
                            <span class="selected-movie-duration">⏱️ ${movieInfo.duration}</span>
                            <span class="selected-movie-rating">⭐ ${movieInfo.rating}/5</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Generate dates for the next 7 days
    generateDates() {
        const dateContainer = document.getElementById('dateContainer');
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dateCard = document.createElement('div');
            dateCard.className = 'date-card';
            if (i === 0) {
                dateCard.classList.add('active');
                this.selectedDate = date.toISOString().split('T')[0];
            }
            
            const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
            const dayNumber = date.getDate();
            const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
            
            dateCard.innerHTML = `
                <div class="date-day">${dayName}</div>
                <div class="date-number">${dayNumber}</div>
                <div class="date-month">${monthName}</div>
            `;
            
            dateCard.addEventListener('click', () => this.selectDate(dateCard, date));
            dateContainer.appendChild(dateCard);
        }
    }

    // Select date
    selectDate(element, date) {
        document.querySelectorAll('.date-card').forEach(card => {
            card.classList.remove('active');
        });
        element.classList.add('active');
        this.selectedDate = date.toISOString().split('T')[0];
        this.generateSchedule();
    }

    // Generate movie schedule (only for selected movie)
    generateSchedule() {
        const scheduleContainer = document.getElementById('scheduleContainer');
        scheduleContainer.innerHTML = '';

        const movieData = this.getMovieData(this.selectedMovie);
        if (movieData) {
            const scheduleCard = document.createElement('div');
            scheduleCard.className = 'schedule-card focused-movie';
            
            scheduleCard.innerHTML = `
                <div class="schedule-times">
                    <h4 class="times-title">Pilih Jam Tayang untuk ${this.selectedMovie}</h4>
                    <div class="times-container">
                        ${movieData.showtimes.map(time => `
                            <button class="time-slot" onclick="scheduleManager.bookTicket('${this.selectedMovie}', '${time}')">
                                ${time}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            scheduleContainer.appendChild(scheduleCard);
        }
    }

    // Book ticket function
    bookTicket(movieTitle, showtime) {
        const loginStatus = this.checkUserLogin();
        
        if (!loginStatus.isLoggedIn) {
            alert('Silakan login terlebih dahulu untuk memesan tiket.');
            window.location.href = 'login.html';
            return;
        }

        // Save booking information
        localStorage.setItem('filmDipilih', movieTitle);
        localStorage.setItem('selectedShowTime', showtime);
        localStorage.setItem('selectedDate', this.selectedDate);
        
        console.log('Booking data saved:', {
            filmDipilih: movieTitle,
            selectedShowTime: showtime,
            selectedDate: this.selectedDate
        });
        
        // Show notification if available
        try {
            const notificationManager = NotificationManager.getInstance();
            notificationManager.success(`Jadwal dipilih: ${showtime} - Lanjut pilih kursi`);
        } catch (error) {
            alert(`Jadwal dipilih: ${showtime} - Lanjut pilih kursi`);
        }
        
        // Redirect to seat selection
        setTimeout(() => {
            window.location.href = 'pilih_kursi.html';
        }, 1000);
    }

    // Check user login status
    checkUserLogin() {
        let currentUser = null;
        let isLoggedIn = false;

        // Try multiple ways to check login status
        try {
            // Method 1: SessionManager
            if (typeof SessionManager !== 'undefined') {
                const sessionManager = SessionManager.getInstance();
                if (sessionManager.isLoggedIn()) {
                    currentUser = sessionManager.getCurrentUser();
                    isLoggedIn = true;
                }
            }
        } catch (error) {
            console.log('SessionManager check failed:', error);
        }

        // Method 2: Direct localStorage check
        if (!isLoggedIn) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                    isLoggedIn = true;
                } catch (error) {
                    console.log('localStorage parse failed:', error);
                }
            }
        }

        console.log('Login check result:', { isLoggedIn, currentUser });
        return { isLoggedIn, currentUser };
    }

    // Initialize user display
    initializeUserDisplay() {
        const loginStatus = this.checkUserLogin();
        
        if (loginStatus.isLoggedIn && loginStatus.currentUser) {
            const userInitial = document.getElementById('userInitial');
            const usernameDisplay = document.getElementById('usernameDisplay');
            
            if (userInitial && usernameDisplay) {
                userInitial.textContent = loginStatus.currentUser.username.charAt(0).toUpperCase();
                usernameDisplay.textContent = loginStatus.currentUser.username;
            }
        } else {
            console.log('No user found, but continuing to show schedule page');
            const userInitial = document.getElementById('userInitial');
            const usernameDisplay = document.getElementById('usernameDisplay');
            
            if (userInitial && usernameDisplay) {
                userInitial.textContent = 'G';
                usernameDisplay.textContent = 'Guest';
            }
        }
    }

    // Initialize schedule page
    async initialize() {
        if (!this.validateSelectedMovie()) {
            return;
        }

        await this.loadScheduleData();
        this.showSelectedMovieInfo();
        this.generateDates();
        this.generateSchedule();
        this.initializeUserDisplay();
    }
}