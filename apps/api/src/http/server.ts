import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const app = Fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running')
})
