document.addEventListener('DOMContentLoaded', () => {
    let watchLaterList = JSON.parse(localStorage.getItem('watchLater')) || [];

    const displayWatchLaterList = () => {
        const listContainer = document.getElementById('watch-later-list');
        listContainer.innerHTML = watchLaterList.map(anime => `
            <div class="anime-item">
                <a href="anime-details.html?id=${anime.id}">
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <h3>${anime.title.romaji}</h3>
                </a>
                <button onclick="removeFromWatchLater(${anime.id})">Remove</button>
            </div>
        `).join('');
    };

    window.removeFromWatchLater = (animeId) => {
        watchLaterList = watchLaterList.filter(item => item.id !== animeId);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
        displayWatchLaterList();
    };

    displayWatchLaterList();
});
