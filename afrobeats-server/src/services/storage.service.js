import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'

import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_PUBLIC_BUCKET,
  R2_PRIVATE_BUCKET,
} = process.env

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_PUBLIC_BUCKET ||
  !R2_PRIVATE_BUCKET
) {
  throw new Error(
    'Cloudflare R2 environment variables are not fully configured'
  )
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export const R2_BUCKETS = {
  PUBLIC: R2_PUBLIC_BUCKET,
  PRIVATE: R2_PRIVATE_BUCKET,
}

export async function testR2Connection() {
  const buckets = [
    R2_PUBLIC_BUCKET,
    R2_PRIVATE_BUCKET,
  ]

  for (const bucket of buckets) {
    await r2.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 1,
      })
    )

    console.log(
      `R2 connection successful: ${bucket}`
    )
  }

  return true
}

export async function uploadObject({
  bucket,
  key,
  body,
  contentType,
}) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )

  return {
    bucket,
    key,
  }
}

export async function uploadLargeObject({
  bucket,
  key,
  body,
  contentType,
}) {
  const upload = new Upload({
    client: r2,

    params: {
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    },

    queueSize: 4,
    partSize: 10 * 1024 * 1024,
    leavePartsOnError: false,
  })

  await upload.done()

  return {
    bucket,
    key,
  }
}

export async function getObject({
  bucket,
  key,
}) {
  return r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
}

export async function deleteObject({
  bucket,
  key,
}) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )

  
}

export async function createSignedDownloadUrl({
  key,
  expiresIn = 300,
}) {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKETS.PRIVATE,
    Key: key,
  })

  return getSignedUrl(
    r2,
    command,
    {
      expiresIn,
    }
  )
}