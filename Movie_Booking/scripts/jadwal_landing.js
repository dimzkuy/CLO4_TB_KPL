let scheduleData = {};
let selectedDate = null;

// Load schedule data from JSON file
async function loadScheduleData() {
    try {
        console.log('Loading schedule data...');
        const response = await fetch('../data/scheduleData.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        scheduleData = await response.json();
        console.log('Schedule data loaded:', scheduleData);
        generateSchedule();
        return scheduleData;
    } catch (error) {
        console.error('Error loading schedule data:', error);
        // Fallback data jika JSON gagal dimuat
        scheduleData = {
            "Inception": {
                "poster": "../img/Inception.jpeg",
                "genre": "Sci-Fi, Adventure",
                "duration": "148 menit",
                "rating": "4.8",
                "showtimes": ["10:00", "13:30", "16:45", "19:30", "22:15"]
            },
            "Interstellar": {
                "poster": "../img/Interstelar.jpeg",
                "genre": "Adventure, Drama, Sci-Fi",
                "duration": "169 menit",
                "rating": "4.7",
                "showtimes": ["09:30", "13:00", "16:30", "20:00"]
            },
            "The Dark Knight": {
                "poster": "../img/The_Dark_Knight.jpeg",
                "genre": "Action, Crime, Drama",
                "duration": "152 menit",
                "rating": "4.9",
                "showtimes": ["11:00", "14:30", "18:00", "21:30"]
            },
            "The Shawshank Redemption": {
                "poster": "../img/The_Shawshank_Redemption.jpeg",
                "genre": "Drama, Crime",
                "duration": "142 menit",
                "rating": "4.6",
                "showtimes": ["10:30", "14:00", "17:30", "21:00"]
            }
        };
        generateSchedule();
        return scheduleData;
    }
}

// Generate dates for the next 7 days
function generateDates() {
    console.log('Generating dates...');
    const dateContainer = document.getElementById('dateContainer');
    
    if (!dateContainer) {
        console.error('Date container not found!');
        return;
    }
    
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateCard = document.createElement('div');
        dateCard.className = 'date-card';
        if (i === 0) {
            dateCard.classList.add('active');
            selectedDate = date.toISOString().split('T')[0];
        }
        
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        const dayNumber = date.getDate();
        const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
        
        dateCard.innerHTML = `
            <div class="date-day">${dayName}</div>
            <div class="date-number">${dayNumber}</div>
            <div class="date-month">${monthName}</div>
        `;
        
        dateCard.addEventListener('click', () => selectDate(dateCard, date));
        dateContainer.appendChild(dateCard);
    }
    console.log('Dates generated successfully');
}

// Select date
function selectDate(element, date) {
    document.querySelectorAll('.date-card').forEach(card => {
        card.classList.remove('active');
    });
    element.classList.add('active');
    selectedDate = date.toISOString().split('T')[0];
    generateSchedule();
}

// Generate movie schedule (VIEW ONLY VERSION)
function generateSchedule() {
    console.log('Generating schedule...');
    const scheduleContainer = document.getElementById('scheduleContainer');
    
    if (!scheduleContainer) {
        console.error('Schedule container not found!');
        return;
    }
    
    scheduleContainer.innerHTML = '';

    if (Object.keys(scheduleData).length === 0) {
        scheduleContainer.innerHTML = '<p>Memuat jadwal...</p>';
        return;
    }

    Object.entries(scheduleData).forEach(([movieTitle, movieData]) => {
        const scheduleCard = document.createElement('div');
        scheduleCard.className = 'schedule-card';
        
        scheduleCard.innerHTML = `
            <div class="schedule-movie-info">
                <img src="${movieData.poster}" alt="${movieTitle}" class="schedule-poster">
                <div class="schedule-details">
                    <h3 class="schedule-movie-title">${movieTitle}</h3>
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
                        <div class="time-slot-display">
                            ${time}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        scheduleContainer.appendChild(scheduleCard);
    });
    
    console.log('Schedule generated successfully');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing jadwal landing page');
    
    // Generate dates first
    generateDates();
    
    // Then load schedule data
    loadScheduleData();
});