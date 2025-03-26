const axios = require('axios')

const fetchTopTrackApi = async(spotifyAccessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks',{headers: {Authorization: `Bearer ${spotifyAccessToken}`}})
        const topTrack = response.data.items[0]
        return {name: topTrack.name}
    } catch (error) {
        console.log("Error occured while trying to fetch top tracks", error.message)
        throw new Error('Error occured while trying to fetch top tracks', error.message)
    }
}

module.exports = {fetchTopTrackApi}