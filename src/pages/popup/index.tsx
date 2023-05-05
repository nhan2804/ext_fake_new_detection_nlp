import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { QueryClientProvider, QueryClient } from 'react-query'
import { NextUIProvider } from '@nextui-org/react'
// import '../../index.css'

const root = document.querySelector('#root')
const queryClient = new QueryClient()
render(
  <QueryClientProvider client={queryClient}>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </QueryClientProvider>,
  root,
)
