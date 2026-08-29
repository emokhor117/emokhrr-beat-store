import multer from 'multer'

const storage = multer.memoryStorage()

export const uploadBeatAsset = multer({
  storage,

  limits: {
    fileSize: 200 * 1024 * 1024,
  },
}).single('file')