const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';




function resetModal() {
    document.querySelectorAll('.modal-title').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    document.querySelectorAll('.modal-directors').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    document.querySelectorAll('.modal-genres').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    document.querySelectorAll('.modal-duration').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    document.querySelectorAll('.modal-rating').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    document.querySelectorAll('.modal-budget').forEach(element => {
        element.textContent = '';
    });
    document.querySelectorAll('.modal-synopsis').forEach(element => {
        element.textContent = 'Chargement des informations...';
    });
    
}


function humanReadableNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    } else {
        return number.toLocaleString('fr-FR');
    }
}

async function getMoviesByGenres(genreName) {
    var queryParams = new URLSearchParams();
    queryParams.append('genre', genreName);
    queryParams.append('page_size', 8);
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
    resetModal();
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
                element.textContent = `${movieData.year || ''} - ${movieData.genres.join(', ')}`;
            });
        }
        
        if (movieData.duration) {
            const durationElements = document.querySelectorAll('.modal-duration');
            durationElements.forEach(element => {
                element.textContent = `${movieData.rated} - ${movieData.duration} minutes (${movieData.countries.join(', ')})`;
            });
        }
        if (movieData.imdb_score) {
            const ratingElements = document.querySelectorAll('.modal-rating');
            ratingElements.forEach(element => {
                element.textContent = `IMDB Score: ${movieData.imdb_score} / 10`;
            });
        }
        if (movieData.worldwide_gross_income) {
            const budgetElements = document.querySelectorAll('.modal-budget');
            budgetElements.forEach(element => {
                element.textContent = `Recettes au box-office: ${humanReadableNumber(movieData.worldwide_gross_income)} $`;
            });
        }

        
        if (movieData.long_description) {
            const synopsisElements = document.querySelectorAll('.modal-synopsis');
            synopsisElements.forEach(element => {
                element.textContent = movieData.long_description;
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
        
        // Determine initial number of movies to show based on screen width
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const initialMoviesToShow = isMobile ? 2 : (isTablet ? 4 : 8);
        
        // Get the corresponding "Voir plus" button for this container
        const voirPlusButton = container.parentElement.querySelector('button');
        
        // Create and display initial movie cards
        createMovieCards(movies.slice(0, initialMoviesToShow), container);
        
        // Set up the "Voir plus" button
        if (voirPlusButton) {
            if (movies.length > initialMoviesToShow && (isMobile || isTablet)) {
                // Store remaining movies for later use
                const remainingMovies = movies.slice(initialMoviesToShow);
                let showingAll = false;
                
                // Add click handler to load more movies
                voirPlusButton.onclick = function() {
                    if (!showingAll) {
                        // Add the remaining movies to the container
                        createMovieCards(remainingMovies, container);
                        
                        // Update button text
                        this.textContent = "Tout est affiché";
                        this.classList.add("bg-gray-500");
                        this.classList.remove("bg-red-600");
                        showingAll = true;
                    }
                };
                
                // Make sure button is visible on mobile and tablet
                voirPlusButton.style.display = "block";
                voirPlusButton.textContent = "Voir plus";
                voirPlusButton.classList.add("bg-red-600");
                voirPlusButton.classList.remove("bg-gray-500");
                
                // Make sure it's visible on tablet
                voirPlusButton.classList.remove("md:hidden");
                // But hide on desktop
                if (window.innerWidth >= 1024) {
                    voirPlusButton.style.display = "none";
                }
            } else {
                // If no more movies available, still show button but disabled
                voirPlusButton.textContent = "Tout est affiché";
                voirPlusButton.classList.add("bg-gray-500");
                voirPlusButton.classList.remove("bg-red-600");
                
                // Make sure it's visible on tablet
                voirPlusButton.classList.remove("md:hidden");
                // But hide on desktop
                if (window.innerWidth >= 1024) {
                    voirPlusButton.style.display = "none";
                } else {
                    voirPlusButton.style.display = "block";
                }
            }
        }
    } catch (error) {
        console.error('Error displaying most rated movies:', error);
    }
}

// Helper function to create movie cards
function createMovieCards(movies, container) {
    // Default image for fallback
    const defaultImageUrl = 'https://placehold.co/150x100/gray/white?text=No+Image';
    
    // Create movie cards
    movies.forEach(movie => {
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
}

async function displayMoviesByGenre(genreName, containerId) {
    try {
        const data = await getMoviesByGenres(genreName);
        const movies = data.results || [];
        
        // Get the container for movies
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('Movies container not found: ' + containerId);
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Determine initial number of movies to show based on screen width
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const initialMoviesToShow = isMobile ? 2 : (isTablet ? 4 : 8);
        
        // Get the corresponding "Voir plus" button for this container
        const voirPlusButton = container.parentElement.querySelector('button');
        
        // Create and display initial movie cards
        createMovieCards(movies.slice(0, initialMoviesToShow), container);
        
        // Set up the "Voir plus" button
        if (voirPlusButton) {
            if (movies.length > initialMoviesToShow && (isMobile || isTablet)) {
                // Store remaining movies for later use
                const remainingMovies = movies.slice(initialMoviesToShow);
                let showingAll = false;
                
                // Add click handler to load more movies
                voirPlusButton.onclick = function() {
                    if (!showingAll) {
                        // Add the remaining movies to the container
                        createMovieCards(remainingMovies, container);
                        
                        // Update button text
                        this.textContent = "Tout est affiché";
                        this.classList.add("bg-gray-500");
                        this.classList.remove("bg-red-600");
                        showingAll = true;
                    }
                };
                
                // Make sure button is visible on mobile and tablet
                voirPlusButton.style.display = "block";
                voirPlusButton.textContent = "Voir plus";
                voirPlusButton.classList.add("bg-red-600");
                voirPlusButton.classList.remove("bg-gray-500");
                
                // Make sure it's visible on tablet
                voirPlusButton.classList.remove("md:hidden");
                // But hide on desktop
                if (window.innerWidth >= 1024) {
                    voirPlusButton.style.display = "none";
                }
            } else {
                // If no more movies available, still show button but disabled
                voirPlusButton.textContent = "Tout est affiché";
                voirPlusButton.classList.add("bg-gray-500");
                voirPlusButton.classList.remove("bg-red-600");
                
                // Make sure it's visible on tablet
                voirPlusButton.classList.remove("md:hidden");
                // But hide on desktop
                if (window.innerWidth >= 1024) {
                    voirPlusButton.style.display = "none";
                } else {
                    voirPlusButton.style.display = "block";
                }
            }
        }
    } catch (error) {
        console.error('Error displaying movies:', error);
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
    
    // Add window resize handler to adjust movie display when screen size changes
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce resize event to prevent excessive rerendering
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Only reload if we cross a breakpoint boundary
            const wasMobile = window.innerWidth < 768;
            const wasTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            const wasDesktop = window.innerWidth >= 1024;
            
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            const isDesktop = window.innerWidth >= 1024;
            
            // If we crossed a breakpoint boundary, reload the movies
            if ((wasMobile !== isMobile) || (wasTablet !== isTablet) || (wasDesktop !== isDesktop)) {
                // Force buttons to be properly visible/hidden based on new screen size
                if (isDesktop) {
                    // Hide all Voir plus buttons on desktop
                    document.querySelectorAll('section button').forEach(button => {
                        button.style.display = 'none';
                    });
                } else {
                    // Show Voir plus buttons on mobile and tablet
                    document.querySelectorAll('section button').forEach(button => {
                        button.style.display = 'block';
                        // Reset button appearance if needed
                        if (button.textContent === "Voir plus") {
                            button.classList.add("bg-red-600");
                            button.classList.remove("bg-gray-500");
                        }
                    });
                }
                
                // Reload the movie sections
                displayMostRatedMovies();
                displayMoviesByGenre('Mystery', 'mystery-movies');
                displayMoviesByGenre('Action', 'action-movies');
                displayMoviesByGenre('Drama', 'drama-movies');
                
                // Reload the selected category
                if (headerCategorySelect) {
                    const selectedCategory = headerCategorySelect.value || 'Action';
                    displayMoviesByGenre(selectedCategory, "selected-movies");
                }
            }
        }, 250); // Wait 250ms after resize ends
    });
});



