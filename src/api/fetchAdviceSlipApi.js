const axios = require('axios')

const fetchAdviceSlipApi = async(trackName) => {
    const sanitizedTrackName = trackName.toLowerCase().replace(/[^a-z\s]/g, '').split(' ')[0]
    try {
        const response = await axios.get(`https://api.adviceslip.com/advice/search/${sanitizedTrackName}`)
        const advice = response.data.slips?.[0]?.advice || "advice not found"
        return advice
    } catch (error) {
        throw new Error('Failed to fetch advice from adviceslip api', error.message)
    }
}

module.exports = {fetchAdviceSlipApi} 