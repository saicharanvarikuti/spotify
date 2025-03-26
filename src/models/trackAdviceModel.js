const mongoose = require('mongoose')

const trackAdviceSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    track:{
        name:{type:String, required: true}
    },
    advice:{
        advice: {type: String, required: true},
        searched_at: {type: Date, default: Date.now}
    }
})

module.exports = mongoose.model('TrackAdvice', trackAdviceSchema)