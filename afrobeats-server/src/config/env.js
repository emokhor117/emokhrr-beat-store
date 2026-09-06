const REQUIRED_ENV_VARIABLES = [
  'DATABASE_URL',

  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_PUBLIC_BUCKET',
  'R2_PRIVATE_BUCKET',

  'PAYSTACK_SECRET_KEY',

  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH',
  'ADMIN_JWT_SECRET',
]

export function validateEnvironment() {
  const missingVariables =
    REQUIRED_ENV_VARIABLES.filter(
      (name) => {
        const value =
          process.env[name]

        return (
          typeof value !== 'string' ||
          value.trim() === ''
        )
      }
    )

  if (missingVariables.length > 0) {
    console.error(
      '\n❌ Missing required environment variables:'
    )

    for (
      const variable
      of missingVariables
    ) {
      console.error(
        `   - ${variable}`
      )
    }

    console.error(
      '\nCheck your .env configuration.\n'
    )

    throw new Error(
      'INVALID_ENVIRONMENT_CONFIGURATION'
    )
  }

  console.log(
    '✅ Environment configuration validated'
  )
}