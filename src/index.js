import { configDotenv } from 'dotenv'
const mongoose = require('mongoose')

configDotenv()

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('connected to database'))
    .catch((err)=> console.error('Error connecting to Database' ,err))

app.use(express.json())

app.listen(PORT, ()=>console.log('server running on port: ', PORT))
