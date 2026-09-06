import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { validateEnvironment } from './config/env.js'

import checkoutRoutes from './routes/checkout.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import beatAssetRoutes from './routes/beat-asset.routes.js'
import downloadRoutes from './routes/download.routes.js'
import adminAuthRoutes from './routes/admin-auth.routes.js'
import beatRoutes from './routes/beat.routes.js'

validateEnvironment()

const app = express()

const PORT =
  Number(process.env.PORT) || 5000

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  'http://localhost:5173'

/*
 * =========================
 * Security headers
 * =========================
 */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
)

/*
 * =========================
 * CORS
 * =========================
 */
app.use(
  cors({
    origin: FRONTEND_URL,

    methods: [
      'GET',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-order-access-token',
    ],
  })
)

/*
 * =========================
 * Body limits
 * =========================
 */
app.use(
  express.json({
    limit: '20kb',
  })
)

app.use(
  express.urlencoded({
    extended: false,
    limit: '20kb',
  })
)

/*
 * =========================
 * Rate limiting
 * =========================
 */
const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 200,

    standardHeaders:
      'draft-8',

    legacyHeaders: false,

    message: {
      success: false,
      message:
        'Too many requests. Please try again later.',
    },
  })

app.use('/api', apiLimiter)

/*
 * =========================
 * Health
 * =========================
 */
app.get(
  '/api/health',
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        'EMOKHRR Beats API is running',
    })
  }
)

/*
 * =========================
 * API routes
 * =========================
 */

// ✅ beats now comes AFTER CORS
app.use(
  '/api/beats',
  beatRoutes
)

app.use(
  '/api/checkout',
  checkoutRoutes
)

app.use(
  '/api/payments',
  paymentRoutes
)

app.use(
  '/api',
  downloadRoutes
)

app.use(
  '/api',
  adminAuthRoutes
)

app.use(
  '/api',
  beatAssetRoutes
)

/*
 * =========================
 * Unknown API routes
 * =========================
 */
app.use(
  '/api',
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        'API route not found',
    })
  }
)

/*
 * =========================
 * Error handler
 * =========================
 */
app.use(
  (err, req, res, next) => {
    console.error(
      'Unhandled request error:',
      err
    )

    if (
      err?.type ===
      'entity.too.large'
    ) {
      return res
        .status(413)
        .json({
          success: false,
          message:
            'Request body is too large',
        })
    }

    return res
      .status(500)
      .json({
        success: false,
        message:
          'Internal server error',
      })
  }
)

app.listen(
  PORT,
  () => {
    console.log(
      `EMOKHRR Beats API running on port ${PORT}`
    )

    console.log(
      `Allowed frontend origin: ${FRONTEND_URL}`
    )
  }
)