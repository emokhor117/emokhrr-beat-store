import 'dotenv/config'

const {
  uploadObject,
  getObject,
  deleteObject,
} = await import('../services/storage.service.js')

const bucket = process.env.R2_PUBLIC_BUCKET
const key = 'tests/connection-test.txt'

const expectedText =
  'EMOKHRR Beats R2 storage test successful.'

try {
  // 1. Upload
  console.log('Uploading test object...')

  await uploadObject({
    bucket,
    key,
    body: expectedText,
    contentType: 'text/plain',
  })

  console.log('Upload successful.')

  // 2. Retrieve
  console.log('Reading test object...')

  const object = await getObject({
    bucket,
    key,
  })

  const actualText =
    await object.Body.transformToString()

  // 3. Verify
  if (actualText !== expectedText) {
    throw new Error(
      'Downloaded object does not match uploaded object'
    )
  }

  console.log('Content verified successfully.')

  // 4. Delete
  console.log('Deleting test object...')

  await deleteObject({
    bucket,
    key,
  })

  console.log('Delete successful.')

  console.log(
    'R2 storage test completed successfully.'
  )
} catch (error) {
  console.error('R2 storage test failed.')

  console.error({
    name: error.name,
    message: error.message,
    code: error.Code ?? error.code,
    statusCode:
      error.$metadata?.httpStatusCode,
  })

  process.exitCode = 1
}