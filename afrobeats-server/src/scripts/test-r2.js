import 'dotenv/config'

const {
  testR2Connection,
} = await import('../services/storage.service.js')

try {
  await testR2Connection()

  console.log(
    'Both R2 buckets are configured correctly.'
  )

  process.exit(0)
} catch (error) {
  console.error('R2 connection test failed.')

  console.error({
    name: error.name,
    message: error.message,
    code: error.Code ?? error.code,
    statusCode:
      error.$metadata?.httpStatusCode,
  })

  process.exit(1)
}