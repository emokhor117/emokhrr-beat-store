import multer from 'multer'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, os.tmpdir())
  },

  filename: (_req, file, cb) => {
    const extension =
      path.extname(file.originalname)

    const randomName =
      crypto.randomBytes(16).toString('hex')

    cb(
      null,
      `emokhrr-${randomName}${extension}`
    )
  },
})

export const uploadBeatAsset = multer({
  storage,

  limits: {
    fileSize: 200 * 1024 * 1024,
  },
}).single('file')