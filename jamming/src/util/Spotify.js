const userToken = "";
let Spotify = {}
Spotify.getAccessToken(userToken,url) {
    if(userToken) {
      return userToken;
    } else {
      GET https://accounts.spotify.com/authorize
      window.location.href.match(/access_token=([^&]*)/,url)
    }
  }
}

module.exports = Spotify; 