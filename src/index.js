const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const trackAdviceRoutes = require('./routes/trackAdviceRoutes')

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('connected to database'))
    .catch((err)=> console.error('Error connecting to Database' ,err))

app.use(express.json())
app.use('/api',trackAdviceRoutes)

app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(500).json({error: 'Something went wrong'})
})

app.listen(PORT, ()=>console.log('server running on port: ', PORT))
