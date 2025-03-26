const express = require('express')
const router = express.Router()
const {fetchTopTrackApi} = require('../api/fetchTopTrackApi')
const {fetchAdviceSlipApi} = require('../api/fetchAdviceSlipApi')
const trackAdviceModel = require('../models/trackAdviceModel')

router.get('/user/:user_id/track-advice', async(req, res)=>{
    const {user_id} = req.params
    try {
        const accessToken = ''
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