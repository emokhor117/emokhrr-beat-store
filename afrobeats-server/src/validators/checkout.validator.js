import { z } from 'zod'

export const checkoutSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .max(254),

    items: z
      .array(
        z
          .object({
            beatId: z
              .string()
              .trim()
              .min(1)
              .max(100),

            licenseId: z
              .string()
              .trim()
              .min(1)
              .max(100),
          })
          .strict()
      )
      .min(1)
      .max(20),
  })
  .strict()