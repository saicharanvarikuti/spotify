const express = require('express')
const router = express.Router()

router.get('/user/:user_id/track-advice', async(req, res)=>{
    const {user_id} = req.params
    try {
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router;