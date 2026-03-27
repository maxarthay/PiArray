import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { ApolloProvider } from '@apollo/client/react'
import './index.css'
import Map from './Map.jsx'
import TestMap from './TestMap.jsx'
import Sidebar from './Sidebar.jsx'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Map />
      <Sidebar />
    </ApolloProvider>
  </StrictMode>,
)
