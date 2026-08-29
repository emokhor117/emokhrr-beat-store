import 'dotenv/config'
import checkoutRoutes from './routes/checkout.routes.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import paymentRoutes from './routes/payment.routes.js'
import beatAssetRoutes from './routes/beat-asset.routes.js'
import downloadRoutes from './routes/download.routes.js'

const app = express()

const PORT = process.env.PORT || 5000
const FRONTEND_URL =
  process.env.FRONTEND_URL || 'http://localhost:5173'

// Security headers
app.use(helmet())

// Only our frontend should normally access the API from a browser
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  })
)

// Limit JSON request size
app.use(
  express.json({
    limit: '20kb',
  })
)

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

app.use('/api', apiLimiter)

app.use('/api/checkout', checkoutRoutes)
app.use('/api/payments', paymentRoutes)
app.use(
  '/api/admin',
  beatAssetRoutes
)
app.use('/api', downloadRoutes)
// Health endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EMOKHRR Beats API is running',
  })
})


// Unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  })
})

// Central error handler
app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`EMOKHRR Beats API running on port ${PORT}`)
})