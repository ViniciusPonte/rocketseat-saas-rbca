import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { createAccount } from './routes/auth/create-account'
import type { ZodOpenApiVersion } from 'zod-openapi'
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyZodOpenApiPlugin)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS APP with multi-tenant & RBAC',
      version: '1.0.0',
    },
    openapi: '3.0.3' satisfies ZodOpenApiVersion,
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running')
})
