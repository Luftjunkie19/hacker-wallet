import React from 'react'

type Props = {
    children:React.ReactNode
}
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


function TanstackQueryProvider({children}: Props) {
 return (
    <QueryClientProvider client={queryClient}>
{children}
    </QueryClientProvider>
  )
}

export default TanstackQueryProvider