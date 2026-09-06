import express from 'express'
import { listBeats } from '../controllers/beat.controller.js'

const router = express.Router()

router.get('/', listBeats)

export default router