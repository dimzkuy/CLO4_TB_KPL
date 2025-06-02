// Singleton untuk mengelola data film
class MovieManager {
    constructor() {
        if (MovieManager.instance) {
            return MovieManager.instance;
        }
        
        this.movies = [];
        this.selectedMovie = null;
        this.movieKey = 'selectedMovie';
        
        this.initializeMovies();
        this.loadSelectedMovie();
        
        MovieManager.instance = this;
        return this;
    }
    
    static getInstance() {
        if (!MovieManager.instance) {
            MovieManager.instance = new MovieManager();
        }
        return MovieManager.instance;
    }
    
    // Initialize default movies
    initializeMovies() {
        this.movies = [
            {
                id: 1,
                title: 'Inception',
                genre: 'Sci-Fi, Adventure',
                rating: 4.8,
                poster: '../img/Inception.jpeg',
                available: true
            },
            {
                id: 2,
                title: 'Interstellar',
                genre: 'Adventure, Drama, Sci-Fi',
                rating: 4.7,
                poster: '../img/Interstelar.jpeg',
                available: true
            },
            {
                id: 3,
                title: 'The Dark Knight',
                genre: 'Action, Crime, Drama',
                rating: 4.9,
                poster: '../img/The_Dark_Knight.jpeg',
                available: true
            },
            {
                id: 4,
                title: 'The Shawshank Redemption',
                genre: 'Drama, Crime',
                rating: 4.6,
                poster: '../img/The_Shawshank_Redemption.jpeg',
                available: true
            }
        ];
    }
    
    // Get all movies
    getAllMovies() {
        return this.movies;
    }
    
    // Get available movies
    getAvailableMovies() {
        return this.movies.filter(movie => movie.available);
    }
    
    // Get movie by title
    getMovieByTitle(title) {
        return this.movies.find(movie => movie.title === title);
    }
    
    // Select movie
    selectMovie(movieTitle) {
        const movie = this.getMovieByTitle(movieTitle);
        if (movie && movie.available) {
            const sessionManager = SessionManager.getInstance();
            
            this.selectedMovie = {
                ...movie,
                selectedBy: sessionManager.getCurrentUser()?.username,
                selectedAt: new Date().toISOString()
            };
            
            localStorage.setItem(this.movieKey, JSON.stringify(this.selectedMovie));
            return true;
        }
        return false;
    }
    
    // Get selected movie
    getSelectedMovie() {
        return this.selectedMovie;
    }
    
    // Load selected movie from localStorage
    loadSelectedMovie() {
        try {
            const storedMovie = localStorage.getItem(this.movieKey);
            if (storedMovie) {
                this.selectedMovie = JSON.parse(storedMovie);
            }
        } catch (error) {
            console.error('Error loading selected movie:', error);
            this.selectedMovie = null;
        }
    }
    
    // Clear selected movie
    clearSelectedMovie() {
        this.selectedMovie = null;
        localStorage.removeItem(this.movieKey);
    }
}

Object.freeze(MovieManager);