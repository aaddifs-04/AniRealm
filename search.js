// Extract query from URL
const params = new URLSearchParams(window.location.search);
const searchQuery = params.get('query');

// Display search query
document.title = `Search Results for "${searchQuery}"`;

// Use AniList API to fetch search results
async function fetchSearchResults(query) {
    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            query ($search: String) {
                Page(page: 1, perPage: 10) {
                    media(search: $search, type: ANIME) {
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
            variables: { search: query },
        }),
    });

    const data = await response.json();
    return data.data.Page.media;
}

// Function to display search results on the page
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';  // Clear any previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = `<p>No results found for "${searchQuery}".</p>`;
        return;
    }

    results.forEach(anime => {
        const animeCard = `
        <div class="anime-card">
        <a href="anime-details.html?id=${anime.id}">
            <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            <h2>${anime.title.romaji}</h2>
        </a>
            <p>Score: ${anime.averageScore}</p>
        </div>`;
        resultsContainer.innerHTML += animeCard;
    });
}

// Fetch and display results
fetchSearchResults(searchQuery)
    .then(results => displaySearchResults(results))
    .catch(error => console.error('Error fetching search results:', error));
