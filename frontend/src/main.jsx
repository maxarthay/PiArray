import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Map from './Map.jsx'
// import { model } from 'mongoose'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri:
    'http://localhost:3000/graphql',
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Map />
    </ApolloProvider>
  </StrictMode>,
)
