import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import jobRoutes from './routes/jobs.js'
import approveRoutes from './routes/approve.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send("<h1>Hi there! Welcome to IPTTA's Jobs Listing!</h1>")
})

app.use('/api/jobs', jobRoutes)
app.use('/api/approve', approveRoutes)
app.use('/api/admin', adminRoutes)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
