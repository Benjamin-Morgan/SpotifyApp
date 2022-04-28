const APIController = (function(){


    const clientId = 'add your client ID' //add my id here
    const clientSecret = 'add my client secret' //add secret here

    //private methods
    const _getToken = async () => {

        // uses async/await, fetches api token
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // taken from api docs
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })
    }
})