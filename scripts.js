// script.js

// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', function () {

    // Function to display anime on home page inside the main content area
    function displayAnimesOnHomePage() {
        fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                    Page(perPage: 25) {
                        media(type: ANIME, sort: POPULARITY_DESC) {
                            id
                            title {
                                romaji
                                english
                            }
                            coverImage {
                                large
                            }
                            averageScore
                        }
                    }
                }`,
            }),
        })
        .then(response => response.json())
        .then(data => {
            const animeList = data.data.Page.media;
            const mainElement = document.getElementById('anime-list'); // Target the <main> element

            animeList.forEach(anime => {
                // Create a structure to insert into the main section
                const animeHTML = `
                <div class="anime-card">
                    <a href="anime-details.html?id=${anime.id}">
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <h2>${anime.title.romaji}</h2>

                </div>`;
                
                // Append the HTML to the main element
                mainElement.innerHTML += animeHTML;
            });
        })
        .catch(error => console.error('Error fetching anime data:', error));
    }

    // Call this function on the home page to display anime
    if (document.getElementById('anime-list')) {
        displayAnimesOnHomePage();
    }

    // Handle the search functionality
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevent the form from submitting the default way

            const searchQuery = document.getElementById('search-input').value;

            if (searchQuery) {
                // Redirect to the search results page with the search query as a URL parameter
                window.location.href = `search-results.html?query=${encodeURIComponent(searchQuery)}`;
            }
        });
    }
});
