// Global variables
let scheduleManager;
let scheduleData = {};

// Load schedule data from JSON file
async function loadScheduleData() {
    try {
        const response = await fetch('../data/scheduleData.json');
        scheduleData = await response.json();
        return scheduleData;
    } catch (error) {
        console.error('Error loading schedule data:', error);
        return {};
    }
}

// Schedule Manager Class
class ScheduleManager {
    constructor() {
        this.selectedDate = null;
        this.selectedFilm = localStorage.getItem('filmDipilih') || '';
        this.scheduleData = {};
    }

    async initialize() {
        // Load schedule data from JSON
        this.scheduleData = await loadScheduleData();
        
        // Initialize components
        this.generateDates();
        this.displayFilmInfo();
        this.generateSchedule();
    }

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

    selectDate(element, date) {
        document.querySelectorAll('.date-card').forEach(card => {
            card.classList.remove('active');
        });
        element.classList.add('active');
        this.selectedDate = date.toISOString().split('T')[0];
        this.generateSchedule();
    }

    displayFilmInfo() {
        const filmTitle = document.getElementById('filmTitle');
        if (filmTitle && this.selectedFilm) {
            filmTitle.textContent = this.selectedFilm;
        }
    }

    generateSchedule() {
        const scheduleContainer = document.getElementById('scheduleContainer');
        if (!scheduleContainer) return;
        
        scheduleContainer.innerHTML = '';

        if (this.selectedFilm && this.scheduleData[this.selectedFilm]) {
            const movieData = this.scheduleData[this.selectedFilm];
            
            const scheduleCard = document.createElement('div');
            scheduleCard.className = 'schedule-card';
            
            scheduleCard.innerHTML = `
                <div class="schedule-movie-info">
                    <img src="${movieData.poster}" alt="${this.selectedFilm}" class="schedule-poster">
                    <div class="schedule-details">
                        <h3 class="schedule-movie-title">${this.selectedFilm}</h3>
                        <p class="schedule-genre">${movieData.genre}</p>
                        <div class="schedule-meta">
                            <span class="schedule-duration">⏱️ ${movieData.duration}</span>
                            <span class="schedule-rating">⭐ ${movieData.rating}/5</span>
                        </div>
                    </div>
                </div>
                <div class="schedule-times">
                    <h4 class="times-title">Jam Tayang</h4>
                    <div class="times-container">
                        ${movieData.showtimes.map(time => `
                            <button class="time-slot" onclick="selectShowTime('${time}')">
                                ${time}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            
            scheduleContainer.appendChild(scheduleCard);
        } else {
            scheduleContainer.innerHTML = '<p>Film tidak ditemukan atau belum dipilih.</p>';
        }
    }
}

// Select show time function
function selectShowTime(time) {
    localStorage.setItem('selectedShowTime', time);
    localStorage.setItem('selectedDate', scheduleManager.selectedDate);
    window.location.href = 'pilih_kursi.html';
}

// Go back function
function goBack() {
    localStorage.removeItem('filmDipilih');
    window.location.href = 'home.html';
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded, initializing jadwal page');
    
    // Create schedule manager instance
    scheduleManager = new ScheduleManager();
    
    // Initialize the schedule page
    await scheduleManager.initialize();
});