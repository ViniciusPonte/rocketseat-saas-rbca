import type { FastifyInstance } from 'fastify'
import { createAccount } from './auth/create-account'
import { authenticateWithPassword } from './auth/authenticate-with-password'
import { getProfile } from './auth/get-profile'
import { requestPasswordRecover } from './auth/request-password-recover'
import { resetPassword } from './auth/reset-password'
import { authenticateWithGithub } from './auth/authenticate-with-github'

export const routes = (app: FastifyInstance) => {
  // Auth
  app.register(createAccount)
  app.register(authenticateWithPassword)
  app.register(getProfile)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
  app.register(authenticateWithGithub)
  //https://github.com/login/oauth/authorize?client_id=Ov23liwFAPiLoHHxnp6i&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
}
