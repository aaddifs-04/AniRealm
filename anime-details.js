document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://graphql.anilist.co';

    const getAnimeIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const fetchAnimeDetails = async (animeId) => {
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                    }
                    genres
                    episodes
                    averageScore
                }
            }
        `;

        const variables = { id: parseInt(animeId) };

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

            return response.json();
        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    };

    const displayAnimeDetails = (anime) => {
        const detailsContainer = document.getElementById('anime-details');

        const animeDetailsHtml = `
            <div class="anime-image">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
            </div>
            <div class="anime-info">
                <h2>${anime.title.romaji} (${anime.title.english || ''})</h2>
                <p>${anime.description}</p>
                <p><strong>Genres:</strong> ${anime.genres.join(', ')}</p>
                <p><strong>Episodes:</strong> ${anime.episodes}</p>
                <p><strong>Average Score:</strong> ${anime.averageScore}</p>
            </div>
        `;

        detailsContainer.innerHTML = animeDetailsHtml;

        // Determine if the anime is already in Watch Later or Favorites
        let watchLaterList = JSON.parse(localStorage.getItem('watchLater')) || [];
        let favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];
        
        const inWatchLater = watchLaterList.some(item => item.id === anime.id);
        const inFavorites = favoritesList.some(item => item.id === anime.id);

        const actionButtonsHtml = `
            <div class="action-buttons">
                <button id="watch-later-btn">${inWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}</button>
                <button id="favorites-btn">${inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}</button>
            </div>
        `;

        detailsContainer.insertAdjacentHTML('beforeend', actionButtonsHtml);

        document.getElementById('watch-later-btn').addEventListener('click', () => {
            if (inWatchLater) {
                removeFromWatchLater(anime.id);
            } else {
                addToWatchLater(anime);
            }
            location.reload(); // Reload the page to update the button text
        });

        document.getElementById('favorites-btn').addEventListener('click', () => {
            if (inFavorites) {
                removeFromFavorites(anime.id);
            } else {
                addToFavorites(anime);
            }
            location.reload(); // Reload the page to update the button text
        });
    };

    const addToWatchLater = (anime) => {
        let watchLaterList = JSON.parse(localStorage.getItem('watchLater')) || [];
        watchLaterList.push(anime);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
        alert(`${anime.title.romaji} added to Watch Later!`);
    };

    const removeFromWatchLater = (animeId) => {
        let watchLaterList = JSON.parse(localStorage.getItem('watchLater')) || [];
        watchLaterList = watchLaterList.filter(item => item.id !== animeId);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
        alert(`Removed from Watch Later!`);
    };

    const addToFavorites = (anime) => {
        let favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.push(anime);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        alert(`${anime.title.romaji} added to Favorites!`);
    };

    const removeFromFavorites = (animeId) => {
        let favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList = favoritesList.filter(item => item.id !== animeId);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        alert(`Removed from Favorites!`);
    };

    const animeId = getAnimeIdFromUrl();
    if (animeId) {
        const animeData = await fetchAnimeDetails(animeId);
        if (animeData && animeData.data && animeData.data.Media) {
            displayAnimeDetails(animeData.data.Media);
        }
    } else {
        console.error('No anime ID found in the URL');
    }
});
