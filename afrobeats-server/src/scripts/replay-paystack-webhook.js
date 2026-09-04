import 'dotenv/config'
import crypto from 'node:crypto'
import { db } from '../prisma/db.js'

async function main() {
  const secretKey =
    process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is missing'
    )
  }

  const webhookEvents =
    await db.orm.public.WebhookEvent
      .where({
        provider: 'PAYSTACK',
      })
      .all()

  if (
    !webhookEvents ||
    webhookEvents.length === 0
  ) {
    throw new Error(
      'No Paystack webhook event found'
    )
  }

const webhookEvent =
  webhookEvents.sort(
    (a, b) =>
      Number(
        b.createdAt.epochMilliseconds -
        a.createdAt.epochMilliseconds
      )
  )[0]

  const payload =
    webhookEvent.payload

  const rawBody =
    JSON.stringify(payload)

  const signature = crypto
    .createHmac(
      'sha512',
      secretKey
    )
    .update(rawBody)
    .digest('hex')

  console.log(
    'Replaying webhook:',
    webhookEvent.eventId
  )

  const response = await fetch(
    'http://localhost:5000/api/payments/paystack/webhook',
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
        'x-paystack-signature':
          signature,
      },
      body: rawBody,
    }
  )

  console.log(
    'Webhook response:',
    response.status,
    response.statusText
  )
}

main()
  .catch((error) => {
    console.error(
      'Replay failed:',
      error
    )

    process.exitCode = 1
  })