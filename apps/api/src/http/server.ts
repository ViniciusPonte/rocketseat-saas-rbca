import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import type { ZodOpenApiVersion } from 'zod-openapi'
import {
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-zod-openapi'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { routes } from './routes'
import fastifyJwt from '@fastify/jwt'
import { errorHandler } from './error-handler'
import { env } from '@saas/env'

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYWFiZWIzMS1lNzZmLTRkNGUtOGE4Yi00ZjIzNjQwZGMzZjgiLCJpYXQiOjE3NTA1NDgxMjcsImV4cCI6MTc1MTE1MjkyN30.-XVOul-j_na9FsWxyFVer3yDAQmtxcOzNo0keRGOsAM

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyZodOpenApiPlugin)

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS APP with multi-tenant & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    openapi: '3.0.3' satisfies ZodOpenApiVersion,
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

routes(app)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server is running')
})
