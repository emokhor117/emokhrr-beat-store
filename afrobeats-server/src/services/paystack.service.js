import 'temporal-polyfill/full/global'
import { randomUUID } from 'node:crypto'
import { db } from '../prisma/db.js'
import {
  createDownloadGrantsForOrder,
} from './download-grant.service.js'

const PAYSTACK_INITIALIZE_URL =
  'https://api.paystack.co/transaction/initialize'

const PAYSTACK_VERIFY_URL =
  'https://api.paystack.co/transaction/verify'

function generatePaymentReference(orderNumber) {
  const randomPart = randomUUID()
    .replaceAll('-', '')
    .slice(0, 12)
    .toUpperCase()

  return `${orderNumber}-${randomPart}`
}

// --------------------------------------------------
// INITIALIZE PAYSTACK PAYMENT
// --------------------------------------------------

export async function initializePaystackPayment(orderNumber) {
  // 1. Load order from PostgreSQL
  const order = await db.orm.public.Order
    .where({
      orderNumber,
    })
    .first()

  if (!order) {
    throw new Error('ORDER_NOT_FOUND')
  }

  if (order.status !== 'PENDING') {
    throw new Error('ORDER_NOT_PAYABLE')
  }

  // 2. Check Paystack configuration
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    console.error(
      'PAYSTACK_SECRET_KEY is missing from environment'
    )

    throw new Error('PAYSTACK_NOT_CONFIGURED')
  }

  // 3. Generate our own unique reference
  const reference =
    generatePaymentReference(order.orderNumber)

  const frontendUrl =
  process.env.FRONTEND_URL ||
  'http://localhost:5173'

const callbackUrl =
  `${frontendUrl}/payment-success?order=${encodeURIComponent(
    order.orderNumber
  )}`
  // 4. Initialize transaction with Paystack
  const response = await fetch(
    PAYSTACK_INITIALIZE_URL,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email: order.customerEmail,

        // SECURITY:
        // Amount comes from PostgreSQL,
        // never from the frontend.
        amount: String(order.totalKobo),

        currency: order.currency,

        reference,

        metadata: JSON.stringify({
          orderNumber: order.orderNumber,
        }),
      }),
    }
  )

  const paystackResponse = await response.json()

  if (
    !response.ok ||
    !paystackResponse.status ||
    !paystackResponse.data
  ) {
    console.error(
      'Paystack initialization failed:',
      paystackResponse
    )

    throw new Error(
      'PAYSTACK_INITIALIZATION_FAILED'
    )
  }

  // 5. Save payment attempt in PostgreSQL
  await db.orm.public.Payment.create({
    orderId: order.id,

    provider: 'PAYSTACK',

    providerReference:
      paystackResponse.data.reference,

    expectedAmountKobo:
      order.totalKobo,

    currency:
      order.currency,

    status: 'PENDING',

    providerPayload: {
      authorizationUrl:
        paystackResponse.data.authorization_url,

      accessCode:
        paystackResponse.data.access_code,

      reference:
        paystackResponse.data.reference,
    },
  })

  // 6. Return safe information to frontend
  return {
    orderNumber:
      order.orderNumber,

    reference:
      paystackResponse.data.reference,

    authorizationUrl:
      paystackResponse.data.authorization_url,

    accessCode:
      paystackResponse.data.access_code,

    amountKobo:
      order.totalKobo,

    currency:
      order.currency,
  }
}

// --------------------------------------------------
// VERIFY TRANSACTION DIRECTLY WITH PAYSTACK
// --------------------------------------------------

async function verifyPaystackTransaction(reference) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error('PAYSTACK_NOT_CONFIGURED')
  }

  const response = await fetch(
    `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(
      reference
    )}`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  )

  const result = await response.json()

  if (
    !response.ok ||
    !result.status ||
    !result.data
  ) {
    console.error(
      'Paystack verification failed:',
      result
    )

    throw new Error(
      'PAYSTACK_VERIFICATION_FAILED'
    )
  }

  return result.data
}

// --------------------------------------------------
// PROCESS VERIFIED PAYSTACK WEBHOOK
// --------------------------------------------------
function getWebhookEventId(event) {
  const eventType = event?.event
  const reference = event?.data?.reference

  if (!eventType || !reference) {
    throw new Error('INVALID_WEBHOOK_DATA')
  }

  return `${eventType}:${reference}`
}

export async function processPaystackWebhook(event) {
  const webhookTransaction = event?.data

  if (!webhookTransaction?.reference) {
    throw new Error('INVALID_WEBHOOK_DATA')
  }

  const reference =
    webhookTransaction.reference


  const eventId =
  getWebhookEventId(event)

const existingEvent =
  await db.orm.public.WebhookEvent
    .where({
      provider: 'PAYSTACK',
      eventId,
    })
    .first()

if (existingEvent?.processed) {
  return {
    success: true,
    alreadyProcessed: true,
    reference,
  }
}

if (!existingEvent) {
  await db.orm.public.WebhookEvent.create({
    provider: 'PAYSTACK',
    eventId,
    eventType: event.event,
    payload: event,
    processed: false,
  })
}

  const payment =
    await db.orm.public.Payment
      .where({
        providerReference: reference,
      })
      .first()

  if (!payment) {
    throw new Error('PAYMENT_NOT_FOUND')
  }

if (payment.status === 'SUCCESS') {
  const eventRecord =
    await db.orm.public.WebhookEvent
      .where({
        provider: 'PAYSTACK',
        eventId,
      })
      .first()

  if (
    eventRecord &&
    !eventRecord.processed
  ) {
    await db.orm.public.WebhookEvent
      .where({
        id: eventRecord.id,
      })
      .update({
        processed: true,
        processedAt:
          Temporal.Now.instant(),
      })
  }

  return {
    success: true,
    alreadyProcessed: true,
    reference,
  }
}

  const verified =
    await verifyPaystackTransaction(reference)

  if (verified.status !== 'success') {
    throw new Error(
      'TRANSACTION_NOT_SUCCESSFUL'
    )
  }

  if (verified.reference !== reference) {
    throw new Error(
      'REFERENCE_MISMATCH'
    )
  }

  if (
    Number(verified.amount) !==
    payment.expectedAmountKobo
  ) {
    throw new Error(
      'AMOUNT_MISMATCH'
    )
  }

  if (
    verified.currency !==
    payment.currency
  ) {
    throw new Error(
      'CURRENCY_MISMATCH'
    )
  }

  const order =
    await db.orm.public.Order
      .where({
        id: payment.orderId,
      })
      .first()

  if (!order) {
    throw new Error('ORDER_NOT_FOUND')
  }

  if (
    order.totalKobo !==
    payment.expectedAmountKobo
  ) {
    throw new Error(
      'ORDER_AMOUNT_MISMATCH'
    )
  }

  if (
    order.status === 'PAID' &&
    payment.status !== 'SUCCESS'
  ) {
    throw new Error(
      'INCONSISTENT_PAYMENT_STATE'
    )
  }

await db.transaction(async (tx) => {
  const currentPayment =
    await tx.orm.public.Payment
      .where({
        id: payment.id,
      })
      .first()

  if (!currentPayment) {
    throw new Error(
      'PAYMENT_NOT_FOUND'
    )
  }

  const currentOrder =
    await tx.orm.public.Order
      .where({
        id: order.id,
      })
      .first()

  if (!currentOrder) {
    throw new Error(
      'ORDER_NOT_FOUND'
    )
  }

  if (
    currentPayment.status !== 'SUCCESS' &&
    currentOrder.status !== 'PAID'
  ) {
    await tx.orm.public.Payment
      .where({
        id: payment.id,
      })
      .update({
        status: 'SUCCESS',
        paidAmountKobo:
          Number(verified.amount),
        providerPayload: verified,
      })

    await tx.orm.public.Order
      .where({
        id: order.id,
      })
      .update({
        status: 'PAID',
        paidAt:
          Temporal.Now.instant(),
      })

    await createDownloadGrantsForOrder({
      orderId: order.id,
      orm: tx.orm,
    })
  }

})

  return {
    success: true,
    alreadyProcessed: false,
    orderNumber:
      order.orderNumber,
    reference,
  }
}