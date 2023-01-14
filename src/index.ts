import express from 'express'
import cors from 'cors'

import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { z } from 'zod'

const app = express()
const trpc = initTRPC.create()

const router = trpc.router
const publicProcedure = trpc.procedure

let products = [
  {
    id: 1,
    name: 'product 1',
    description: 'description 1'
  },
  {
    id: 2,
    name: 'product 2',
    description: 'description 2'
  }
]

const appRouter = router({
  hello: publicProcedure.query(() => 'hello world....'),
  products: publicProcedure.query(() => {
    return products
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(({ input }) => {
      products = [
        ...products,
        { id: products.length + 1, name: input.name, description: '' }
      ]

      return 'product created'
    })
})

export type AppRouter = typeof appRouter

app.use(cors())
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter
  })
)

app.listen(3000, () => {
  console.log('listening in port 3000')
})
