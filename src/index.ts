import express from 'express'
import cors from 'cors'

import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

const app = express()
const trpc = initTRPC.create()

const router = trpc.router
const publicProcedure = trpc.procedure

const appRouter = router({
  hello: publicProcedure.query(() => 'hello world....'),
  products: publicProcedure.query(() => {
    return [
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
