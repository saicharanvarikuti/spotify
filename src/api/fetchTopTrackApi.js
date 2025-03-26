const axios = require('axios')

const fetchTopTrackApi = async(spotifyAccessToken) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks',{headers: {Authorization: `Bearer ${spotifyAccessToken}`}, params: {limit:1, time_range: 'short_term'}})
        const topTrack = response.data.items[0]
        return {name: topTrack.name}
    } catch (error) {
        console.log("Error occurred while trying to fetch top tracks", error.message)
        throw new Error('Error occurred while trying to fetch top tracks', error.message)
    }
}

module.exports = {fetchTopTrackApi}