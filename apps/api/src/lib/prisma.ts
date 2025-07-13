import { PrismaClient } from '../../prisma/prisma/generated/prisma'

export const prisma = new PrismaClient({
  log: ['query'],
})
