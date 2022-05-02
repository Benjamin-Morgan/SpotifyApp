const APIController = (function(){


    const clientId = 'add your client ID' //add my id here
    const clientSecret = 'add my client secret' //add secret here

    //private methods
    const _getToken = async () => {

        // uses async/await, fetches api token
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // taken from Spotify api docs
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreID) => {
        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headeres: { 'Authorization' : 'Bearer ' + token}
        })
    }
})
