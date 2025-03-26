const express = require('express')
const router = express.Router()
const {fetchTopTrackApi} = require('../api/fetchTopTrackApi')
const {fetchAdviceSlipApi} = require('../api/fetchAdviceSlipApi')
const trackAdviceModel = require('../models/trackAdviceModel')
const axios = require('axios')

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/spotify');
  };

  const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to refresh token: ' + error.message);
  }
};

router.get('/user/:user_id/track-advice',ensureAuthenticated, async(req, res)=>{
    const {user_id} = req.params
    try {
        const accessToken = req.user.accessToken
        const expiresAt = req.user.expires_in *1000 + Date.now()
        
        if (Date.now() > expiresAt) {
            accessToken = await refreshAccessToken(req.user.refreshToken);
            req.user.accessToken = accessToken; // Update in session
          }
          
        const track = await fetchTopTrackApi(accessToken)
        const adviceText = await fetchAdviceSlipApi(track.name)
        const trackAdvice = new trackAdviceModel({
            user_id,
            track,
            advice:{advice: adviceText}
        })
        await trackAdvice.save()
        res.json(trackAdvice)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router;