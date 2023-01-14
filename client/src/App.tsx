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
  const [newProduct, setNewProduct] = useState('')

  const getProducts = trpc.products.useQuery()
  const createProduct = trpc.createProduct.useMutation()

  const client = trpc.useContext()

  if (getProducts.isLoading) {
    return <h1>Loading...</h1>
  }

  const handleSubmit = (e: any): void => {
    e.preventDefault()
    createProduct.mutate(
      { name: newProduct },
      {
        onSuccess () {
          void client.products.invalidate()
        }
      }
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={newProduct}
          onChange={e => setNewProduct(e.target.value)}
        />
        <button>save</button>
      </form>

      <ul>
        {getProducts.data?.map((product, index) => (
          <li key={index}>
            <p>ID: {product.id}</p>
            <p>{product.name}</p>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
