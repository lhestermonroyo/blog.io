import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { RecoilRoot } from 'recoil';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const HTTP_LINK =
  import.meta.env.VITE_HTTP_LINK || 'http://localhost:8080/graphql';
const WS_LINK =
  import.meta.env.VITE_WS_LINK || 'ws://localhost:8080/subscriptions';

const httpLink = new HttpLink({
  uri: HTTP_LINK,
  credentials: 'include'
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_LINK
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({ addTypename: false })
});

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </ApolloProvider>
);
