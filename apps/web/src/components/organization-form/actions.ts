import { createOrganization } from '@/http/organization/create-organization'
import { updateOrganization } from '@/http/organization/update-organization'
import { createSlug } from '@/utils/create-slug'
import revalidateTagAction from '@/utils/revalidate-tag'
import { getCookie, type CookiesFn } from 'cookies-next'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Please, include at least 4 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },
        {
          message: 'Please, enter a valid domain',
        }
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'Domais is required when auto-join is enabled.',
      path: ['domain'],
    }
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const validData = organizationSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = validData.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })
    revalidateTagAction('organizations')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  redirect(`org/${createSlug(name)}`)
}

export async function updateOrganizationAction(data: FormData) {
  let cookieStore: CookiesFn | undefined
  const currentOrganization = await getCookie('org', { cookies: cookieStore })
  const validData = organizationSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = validData.data

  try {
    await updateOrganization({
      org: currentOrganization!,
      name,
      domain,
      shouldAttachUsersByDomain,
    })
    revalidateTagAction('organizations')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  return { success: true, message: 'Successfully updated!', errors: null }
}
