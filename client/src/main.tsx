import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { RecoilRoot } from 'recoil';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:8080',
  credentials: 'include'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ApolloProvider>
);
