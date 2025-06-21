import type { FastifyInstance } from 'fastify'
import { createAccount } from './auth/create-account'
import { authenticateWithPassword } from './auth/authenticate-with-password'
import { getProfile } from './auth/get-profile'
import { requestPasswordRecover } from './auth/request-password-recover'
import { resetPassword } from './auth/reset-password'

export const routes = (app: FastifyInstance) => {
  // Auth
  app.register(createAccount)
  app.register(authenticateWithPassword)
  app.register(getProfile)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
}
