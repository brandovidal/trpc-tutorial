// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../src'

export const trpc = createTRPCReact<AppRouter>()
