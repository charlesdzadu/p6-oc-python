const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';





async function getMoviesByGenres(genreName) {
    var queryParams = new URLSearchParams();
    queryParams.append('genre', genreName);
    const response = await fetch(`${API_BASE_URL}/titles?${queryParams.toString()}`);
    const data = await response.json();
    return data;
}


async function getMovieById(id) {
    const response = await fetch(`${API_BASE_URL}/titles/${id}`);
    const data = await response.json();
    return data;
}

async function openModal(movieId) {
    const movieData = await getMovieById(movieId);
    document.getElementById('modalTitle').textContent = movieData.title;
    document.getElementById('modalTitleMobile').textContent = movieData.title;
    
    // Default image for fallback
    const defaultImageUrl = 'https://placehold.co/200x300/gray/white?text=No+Image';
    
    // If we have actual movie data, use it to populate more details
    if (movieData) {
        // Set poster image if available
        if (movieData.image_url) {
            const posterElements = document.querySelectorAll('.modal-poster');
            posterElements.forEach(element => {
                element.src = movieData.image_url;
                element.alt = movieData.title;
                
                // Add error handling for the image
                element.onerror = function() {
                    this.src = defaultImageUrl;
                };
            });
        } else {
            // If no image URL is provided, set default image
            const posterElements = document.querySelectorAll('.modal-poster');
            posterElements.forEach(element => {
                element.src = defaultImageUrl;
                element.alt = movieData.title;
            });
        }
        
        // Set other details if available
        if (movieData.directors) {
            const directorElements = document.querySelectorAll('.modal-directors');
            directorElements.forEach(element => {
                element.textContent = `Par ${movieData.directors.join(', ')}`;
            });
        }
        
        if (movieData.genres) {
            const genreElements = document.querySelectorAll('.modal-genres');
            genreElements.forEach(element => {
                element.textContent = `${movieData.genres.join(', ')} (${movieData.countries || ''}, ${movieData.year || ''})`;
            });
        }
        
        if (movieData.duration) {
            const durationElements = document.querySelectorAll('.modal-duration');
            durationElements.forEach(element => {
                element.textContent = `Durée: ${movieData.duration} minutes`;
            });
        }
        
        if (movieData.description) {
            const synopsisElements = document.querySelectorAll('.modal-synopsis');
            synopsisElements.forEach(element => {
                element.textContent = movieData.description;
            });
        }
        
        if (movieData.actors) {
            const castElements = document.querySelectorAll('.modal-cast');
            castElements.forEach(element => {
                element.textContent = `Distribution: ${movieData.actors.join(', ')}`;
            });
        }
    }
    
    // Get the modal element
    const modal = document.getElementById('movieModal');
    
    // Show the modal with animation
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    
    // Animate the modal content
    const modalContent = modal.querySelector('div');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
}

function closeModal() {
    // Get the modal element
    const modal = document.getElementById('movieModal');
    
    // Hide the modal with animation
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0', 'pointer-events-none');
    
    // Animate the modal content
    const modalContent = modal.querySelector('div');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
}

function getBestMovie() {
    var queryParams = new URLSearchParams();

    queryParams.append('sort_by', '-imdb_score');

    fetch(`${API_BASE_URL}/titles?${queryParams.toString()}`)
        .then(response => response.json())
        .then(async data => {
            var bestMovie = data.results[0];
            bestMovie = await getMovieById(bestMovie.id);
            
            // Set a default placeholder image
            const defaultImageUrl = 'https://placehold.co/300x180/gray/white?text=No+Image';
            
            // Update the Meilleur film section with the fetched data
            document.getElementById('best-movie-title').textContent = bestMovie.title;
            document.getElementById('best-movie-image').src = bestMovie.image_url || defaultImageUrl;
            document.getElementById('best-movie-image').alt = bestMovie.title;
            
            // Add error handling for the image
            const imgElement = document.getElementById('best-movie-image');
            imgElement.onerror = function() {
                this.src = defaultImageUrl;
            };
            
            // Format genre and year info
            const year = bestMovie.year || '';
            const genres = bestMovie.genres ? bestMovie.genres.join(', ') : '';
            document.getElementById('best-movie-info').textContent = 
                `${genres} (${bestMovie.countries || ''}, ${year})`;
            
            // Update description if available
            if (bestMovie.long_description) {
                document.getElementById('best-movie-description').textContent = bestMovie.long_description;
            }
            
            // Update the modal open button to use this movie's details
            document.getElementById('best-movie-button').onclick = async function() {
                await openModal(bestMovie.id);
            };
            
            return bestMovie;
        })
        .catch(error => console.error('Error:', error));
}




async function getMostRatedMovies() {
    var queryParams = new URLSearchParams();
    queryParams.append('sort_by', '-imdb_score');
    queryParams.append('page_size', 16);
    
    try {
        const response = await fetch(`${API_BASE_URL}/titles?${queryParams.toString()}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching most rated movies:', error);
        return [];
    }
}

// Function to display the most rated movies in the dedicated section
async function displayMostRatedMovies() {
    try {
        const movies = await getMostRatedMovies();
        const container = document.getElementById('most-rated-movies');
        
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Default image for fallback
        const defaultImageUrl = 'https://placehold.co/150x100/gray/white?text=No+Image';
        
        // Display movies (limit to 4 for desktop on initial load)
        const moviesToShow = window.innerWidth >= 1024 ? 8 : (window.innerWidth >= 768 ? 2 : 1);
        
        // Create movie cards
        movies.slice(0, moviesToShow).forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card cursor-pointer';
            movieCard.onclick = async function() {
                await openModal(movie.id);
            };
            
            movieCard.innerHTML = `
                <img src="${movie.image_url || defaultImageUrl}" alt="${movie.title}" class="w-full h-40 md:h-48 lg:h-52 object-cover rounded-sm">
                <div class="movie-overlay">
                    <span class="movie-title">${movie.title}</span>
                    <button class="movie-details-btn" onclick="openModal('${movie.id}'); event.stopPropagation();">Détails</button>
                </div>
            `;
            
            // Add error handling for the image
            const imgElement = movieCard.querySelector('img');
            imgElement.onerror = function() {
                this.src = defaultImageUrl;
            };
            
            container.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error displaying most rated movies:', error);
    }
}


async function displayMoviesByGenre(genreName, containerId) {
    try {
        const data = await getMoviesByGenres(genreName);
        const movies = data.results || [];
        
        // Get the container for Mystery movies
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('Mystery movies container not found');
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Display movies (limit to 4 for desktop on initial load)
        const moviesToShow = window.innerWidth >= 1024 ? 4 : (window.innerWidth >= 768 ? 2 : 1);
        
        // Create movie cards
        movies.slice(0, moviesToShow).forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card cursor-pointer';
            movieCard.onclick = async function() {
                await openModal(movie.id);
            };
            
            // Set a default placeholder image
            const defaultImageUrl = 'https://placehold.co/150x100/gray/white?text=No+Image';
            
            movieCard.innerHTML = `
                <img src="${movie.image_url || defaultImageUrl}" alt="${movie.title}" class="w-full h-40 md:h-48 lg:h-52 object-cover rounded-sm">
                <div class="movie-overlay">
                    <span class="movie-title">${movie.title}</span>
                    <button class="movie-details-btn" onclick="openModal('${movie.id}'); event.stopPropagation();">Détails</button>
                </div>
            `;
            
            // Add error handling for the image
            const imgElement = movieCard.querySelector('img');
            imgElement.onerror = function() {
                this.src = defaultImageUrl;
            };
            
            container.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error displaying mystery movies:', error);
    }
}



// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    getBestMovie();
    displayMostRatedMovies();
    displayMoviesByGenre('Mystery', 'mystery-movies');
    displayMoviesByGenre('Action', 'action-movies');
    displayMoviesByGenre('Drama', 'drama-movies');
    
    // Add event listener for category changes
    const headerCategorySelect = document.getElementById('header-category-select');
    if (headerCategorySelect) {
        // Get the initial selected value and load it
        const initialCategory = headerCategorySelect.value || 'Action';
        displayMoviesByGenre(initialCategory, "selected-movies");
        
        headerCategorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            console.log(selectedCategory);
            displayMoviesByGenre(selectedCategory, "selected-movies");
        });
    }
});



