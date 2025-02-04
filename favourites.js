document.addEventListener('DOMContentLoaded', () => {
    let favoritesList = JSON.parse(localStorage.getItem('favorites')) || [];

    const displayFavoritesList = () => {
        const listContainer = document.getElementById('favorites-list');
        listContainer.innerHTML = favoritesList.map(anime => `
            <div class="anime-item">
                <a href="anime-details.html?id=${anime.id}">
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <h3>${anime.title.romaji}</h3>
                </a>
                <button onclick="removeFromFavorites(${anime.id})">Remove</button>
            </div>
        `).join('');
    };

    window.removeFromFavorites = (animeId) => {
        favoritesList = favoritesList.filter(item => item.id !== animeId);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        displayFavoritesList();
    };

    displayFavoritesList();
});
