import { z } from 'zod'
export const formSchema = z.object({
  name: z.string().max(300),
  description: z.string().max(300).optional(),
  closeDate: z.date().optional(),
  formSubmissionMessage: z
    .object({
      message: z.string().max(1000).default('our form submitted'),
      link: z.string().optional(),
    })
    .optional(),
  discordNotification: z.boolean().default(false),
})

export type formType = z.infer<typeof formSchema>;