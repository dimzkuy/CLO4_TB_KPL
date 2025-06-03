// Global variables
let scheduleManager;

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