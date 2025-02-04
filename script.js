document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://graphql.anilist.co';
    const query = `
        query {
            Page(perPage: 12) {
                media(type: ANIME, sort: POPULARITY_DESC) {
                    id
                    title {
                        romaji
                    }
                    coverImage {
                        large
                    }
                }
            }
        }
    `;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        const animeList = document.getElementById('anime-list');
        data.data.Page.media.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.classList.add('anime-item');
            animeItem.innerHTML = `
                <a href="anime-details.html?id=${anime.id}">
                <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                <h3>${anime.title.romaji}</h3>
            `;
            animeList.appendChild(animeItem);
        });
    })
    

});
