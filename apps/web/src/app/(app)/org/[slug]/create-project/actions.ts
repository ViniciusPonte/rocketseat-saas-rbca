import { createProject } from '@/http/projects/create-project'
import { queryClient } from '@/lib/react-query'
import revalidateTagAction from '@/utils/revalidate-tag'
import { getCookie, type CookiesFn } from 'cookies-next'
import { HTTPError } from 'ky'
import { z } from 'zod'

const projectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters.' }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const validData = projectSchema.safeParse(Object.fromEntries(data))

  if (!validData.success) {
    const errors = validData.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, description } = validData.data

  let cookieStore: CookiesFn | undefined

  const currentOrganization = await getCookie('org', { cookies: cookieStore })

  try {
    await createProject({
      name,
      description,
      org: currentOrganization!,
    })

    revalidateTagAction(`${currentOrganization}/projects`)
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

  queryClient.invalidateQueries({
    queryKey: [currentOrganization, 'projects'],
  })

  return {
    success: true,
    message: 'Created successfully!',
    errors: null,
  }
}
