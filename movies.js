document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://graphql.anilist.co';

    // Define the list of genres to display
    const genresToDisplay = [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi'
        // Add or remove genres as desired
    ];

    const fetchGenres = async () => {
        const query = `
            query {
                GenreCollection
            }
        `;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data.GenreCollection;
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const fetchAnimesByGenre = async (genre) => {
        const query = `
            query ($genre: String) {
                Page(perPage: 24) {
                    media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                        }
                    }
                }
            }
        `;

        const variables = { genre };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query, variables })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data.Page.media;
        } catch (error) {
            console.error('Error fetching animes by genre:', error);
        }
    };

    const displayGenres = (genres) => {
        // Filter genres to only include those in the genresToDisplay list
        const filteredGenres = genres.filter(genre => genresToDisplay.includes(genre));

        const genreList = document.getElementById('genre-list');
        if (!genreList) {
            console.error('Element with id "genre-list" not found');
            return;
        }

        genreList.innerHTML = filteredGenres.map(genre => `
            <li>
                <a href="#" data-genre="${genre}">${genre}</a>
            </li>
        `).join('');

        // Add event listeners for genre links
        document.querySelectorAll('#genre-list a').forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const selectedGenre = event.target.getAttribute('data-genre');
                const animes = await fetchAnimesByGenre(selectedGenre);
                displayAnimes(animes);
            });
        });

        // Automatically display animes for the first genre by default
        if (filteredGenres.length > 0) {
            const defaultGenre = filteredGenres[0];
            const animes = fetchAnimesByGenre(defaultGenre);
            displayAnimes(animes);
        }
    };

    const displayAnimes = (animes) => {
        const genreAnimeList = document.getElementById('genre-anime-list');
        genreAnimeList.innerHTML = animes.map(anime => `
            <div class="anime-item">
                <a href="anime-details.html?id=${anime.id}">
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <h3>${anime.title.romaji}</h3>
                </a>
            </div>
        `).join('');
    };

    const genres = await fetchGenres();
    if (genres) {
        displayGenres(genres);
    }
});
