import { z } from 'zod'

export const initializePaymentSchema = z
  .object({
    orderNumber: z
      .string()
      .trim()
      .min(1)
      .max(100),
  })
  .strict()