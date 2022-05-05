const { text } = require("body-parser");

const APIController = (function () {


    const clientId = 'add your client ID' //add my id here
    const clientSecret = 'add my client secret' //add secret here

    //private methods
    const _getToken = async () => {

        // uses async/await, fetches api token
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // taken from Spotify api docs
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreID) => {
        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headeres: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, tracksEndPoint) => {
        const result = await fetch(`${tracksEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        _getGenres(token) {
            return _getGenres(token);
        },
        _getPlaylistByGenre(token, genreID) {
            return _getPlaylistByGenre(token, genreID);
        },
        _getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(tokem, tracksEndPoint) {
            return _getTrack(toke, tracksEndPoint);
        }
    }
})();

//UI Module, IIFE this will be immediately invoked
const UIController = (function () {
    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSongList: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSongList),
                submit: document.querySelector(DOMElements.buttonSubmit),
                SongDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        //need mthods to create select list option
        createGenre(text, value) {
            const html = `<option value'${value}'>${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        //need method to create a track list group item
        createTrack(id, name) {
            const html = `<a href="#" class='list-group-item list-group-item-action list-group-item-light' id='${id}'>${name}</a>`;
            document.querySelector(DOMElements.divSongList).insertAdjacentHTML('beforeend', html);
        },

        //need method to create song detail

        createTrackDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            //anytime user clicks a new song,w e need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html =
                `
            <div class='row col-sm-12 px-0'>
                <img src='${img}' alt=''>
            </div>
            <div class='row col-sm-12 px-0'>
                <label for='Genre' class='form-label' col-sm-12>${title}:</label>
            </div>
            <div class='row col-sm-12 px-0'>
                <label for='artist class='form-label col-sm-12'>By ${artist}:</label> 
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        //methods for resetting app
        resetTrackDetail() {
            this.inputField().SongDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },

        storeToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }
})();

const AppController = (function(UICtrl, APICtrl){

    //get input field object reference
    const DOMInputs = UICtrl.inputField();

    //get genres on page load
    const loadGenres = async () => {

        //get token
        const token = await APICtrl.getToken();

        //store token onto the page
        UICtrl.storeToken(token);
        
        //get genres
        const genres = await APICtrl(token);

        //populate our genres select element
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    //create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset playlist
        UICtrl.resetPlaylist();
        //get token that is stored pn page
        const token = UICtrl.getStoredToken().token;
        //get genres select field
        const genreSelect = UICtrl.inputField().genre;
        //get genre id associated with selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        //get the playlist based on a genre
        const playlist = await APICtrl._getPlaylistByGenre(token, genreId);
        //create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });


})


