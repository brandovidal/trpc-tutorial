import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { trpc } from './trpc'
import { httpBatchLink } from '@trpc/client'

function App (): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc'
        })
      ]
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

function AppContent (): JSX.Element {
  const helloMessage = trpc.products.useQuery()
  console.log('🚀 ~ file: App.tsx:31 ~ AppContent ~ helloMessage', helloMessage)

  return <div>{JSON.stringify(helloMessage.data)}</div>
}

export default App
